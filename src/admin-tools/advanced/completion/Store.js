import {Stores} from '@nti/lib-store';
import {getService} from '@nti/web-client';
import {Models} from '@nti/lib-interfaces';

const {Assignment, TimedAssignment, DiscussionAssignment} = Models.assessment.assignment;

const ASSIGNMENT_MIME_TYPES = [Assignment.MimeType, TimedAssignment.MimeType, DiscussionAssignment.MimeType];

export default class CourseAdminCompletionStore extends Stores.SimpleStore {

	constructor () {
		super();

		this.set({
			loading: true
		});
	}

	async saveDefaultPolicy (assignmentsDefault) {
		const service = await getService();

		this.set({assignmentsDefault});

		let types = [];

		if(assignmentsDefault) {
			types = types.concat(ASSIGNMENT_MIME_TYPES);
		}

		try {
			const resp = await service.putParseResponse(this.course.CompletionPolicy.getLink('DefaultRequiredPolicy'), { 'mime_types': types });

			this.set('assignmentsDefault', this.isAssignmentsDefault(resp));
		}
		catch (e) {
			this.set('error', e.message || e);

			// reload to make sure we're synced with the server
			this.load(this.course, true);
		}
	}

	async save (completable, percentage, certificationPolicy) {
		const service = await getService();

		// optimistically emit changes so controls widgets update their state immediately
		// if there is an error, we'll revert and emit the old values with the error
		this.set({completable, certificationPolicy});

		try {
			if(completable) {
				await service.put(this.course.getLink('CompletionPolicy'), {
					MimeType: 'application/vnd.nextthought.completion.aggregatecompletionpolicy',
					percentage: percentage ? percentage / 100.0 : 0,
					'offers_completion_certificate': Boolean(certificationPolicy)
				});
			}
			else {
				// delete from CompletionPolicy?
				const encodedID = encodeURIComponent(this.course.NTIID);

				await service.delete(this.course.getLink('CompletionPolicy') + '/' + encodedID);
			}

			await this.course.refresh();

			this.load(this.course, true);
		}
		catch (e) {
			this.set('error', e.message || e);

			// reload to make sure we're synced with the server
			this.load(this.course, true);
		}
	}

	isAssignmentsDefault (obj) {
		let assignmentsDefault = true;

		const mimeTypes = obj.mimeTypes || obj['mime_types'];

		for(let type of ASSIGNMENT_MIME_TYPES) {
			if(type) {
				assignmentsDefault = assignmentsDefault && mimeTypes.includes(type);
			}
		}

		return assignmentsDefault;
	}

	async load (course, skipLoad) {
		this.course = course;

		if(!skipLoad) {
			this.set('loading', true);
		}

		this.emitChange('loading');

		const service = await getService();

		const {CatalogEntry} = course;

		let state = {
			completable: false,
			certificationPolicy: false,
			percentage: 0.0,
			disabled: !CatalogEntry || !CatalogEntry.hasLink('edit')
		};

		if(this.course.CompletionPolicy) {
			if(this.course.CompletionPolicy.hasLink('DefaultRequiredPolicy')) {
				const policy = await service.get(this.course.CompletionPolicy.getLink('DefaultRequiredPolicy'));

				state.assignmentsDefault = this.isAssignmentsDefault(policy);
			}

			state.completable = true;
			state.certificationPolicy = Boolean(this.course.CompletionPolicy.offersCompletionCertificate);
			state.percentage = (this.course.CompletionPolicy.percentage || 0) * 100;
		}

		state.loading = false;

		this.set(state);
	}
}
