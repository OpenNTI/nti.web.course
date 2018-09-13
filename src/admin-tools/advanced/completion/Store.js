import {Stores} from '@nti/lib-store';
import {getService} from '@nti/web-client';
import {Models} from '@nti/lib-interfaces';

const {Assignment, TimedAssignment, DiscussionAssignment} = Models.assessment.assignment;
const {WebinarAsset} = Models.integrations;
const {VideoRoll} = Models.courses.overview;
const {SurveyReference} = Models.assessment.survey;
const {RelatedWorkReference, LTIExternalToolAsset} = Models.content;

const TYPES = {
	ASSIGNMENTS: 'Assignments',
	WEBINARS: 'Webinars',
	VIDEOS: 'Videos',
	VIDEO_ROLLS: 'Video Rolls',
	SURVEYS: 'Surveys',
	RELATED_WORK: 'Links',
	LTI: 'LTI Tools'
};

const MIME_TYPES_MAP = {
	[TYPES.ASSIGNMENTS]: [Assignment.MimeType, TimedAssignment.MimeType, DiscussionAssignment.MimeType],
	[TYPES.RELATED_WORK]: [RelatedWorkReference.MimeType],
	[TYPES.LTI]: [LTIExternalToolAsset.MimeType],
	[TYPES.SURVEYS]: [SurveyReference.MimeType],
	[TYPES.VIDEOS]: ['application/vnd.nextthought.ntivideo', 'application/vnd.nextthought.video'], // Can't spread Video.MimeTypes?
	[TYPES.VIDEO_ROLLS]: [VideoRoll.MimeType],
	[TYPES.WEBINARS]: [WebinarAsset.MimeType]
};

export default class CourseAdminCompletionStore extends Stores.SimpleStore {

	constructor () {
		super();

		this.set({
			loading: true,
			defaultRequirables: Object.keys(MIME_TYPES_MAP).map(k => {
				return {
					label: k,
					isDefault: false
				};
			})
		});
	}

	async saveDefaultPolicy (label, value) {
		const service = await getService();

		let defaultRequirables = [...(this.get('defaultRequirables') || [])];

		for(let i in defaultRequirables) {
			if(defaultRequirables[i].label === label) {
				defaultRequirables[i].isDefault = value;
			}
		}

		// this will emit the change so the widget updates immediately, but if there is an error, the widget will revert
		this.set('defaultRequirables', defaultRequirables);

		try {
			let types = defaultRequirables.reduce((acc, a) => acc.concat(a.isDefault ? MIME_TYPES_MAP[a.label] : []), []);

			await this.course.CompletionPolicy.putToLink('DefaultRequiredPolicy', { 'mime_types': types });
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
		}
		catch (e) {
			this.set('error', e.message || e);

			// reload to make sure we're synced with the server
			this.load(this.course, true);
		}
	}

	isTypeDefault (obj, type) {
		let isDefault = true;

		const mimeTypes = obj.mimeTypes || obj['mime_types'];

		for(let t of MIME_TYPES_MAP[type]) {
			if(type) {
				isDefault = isDefault && mimeTypes.includes(t);
			}
		}

		return isDefault;
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

				let defaultRequirables = [];

				for(let k of Object.keys(MIME_TYPES_MAP)) {
					defaultRequirables.push({
						label: k,
						isDefault: this.isTypeDefault(policy, k)
					});
				}

				state.defaultRequirables = defaultRequirables;
			}

			state.completable = true;
			state.certificationPolicy = Boolean(this.course.CompletionPolicy.offersCompletionCertificate);
			state.percentage = (this.course.CompletionPolicy.percentage || 0) * 100;
		}

		state.loading = false;

		this.set(state);
	}
}
