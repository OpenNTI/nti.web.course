import { Stores } from '@nti/lib-store';
import { getService } from '@nti/web-client';
import { Models } from '@nti/lib-interfaces';

const { Assignment, TimedAssignment, DiscussionAssignment } =
	Models.assessment.assignment;
const { CourseCalendarEvent } = Models.calendar;
const { WebinarAsset } = Models.integrations;
const { VideoRoll } = Models.courses.overview;
const { SurveyReference, Survey } = Models.assessment.survey;
const {
	RelatedWorkReference,
	LTIExternalToolAsset,
	Package,
	RenderablePackage,
} = Models.content;
const { Video } = Models.media;
const { SCORMContentInfo } = Models.courses.scorm;

const DEFAULT_REQUIRED_POLICY_LINKS = {
	FETCH: 'GetDefaultRequiredPolicy',
	UPDATEDEFAULT: 'UpdateDefaultRequiredPolicy',
	UPDATE: 'UpdateCompletionPolicy',
	RESET: 'ResetCompletionPolicy',
};

const TYPES = {
	ASSIGNMENTS: 'Assignments',
	EVENTS: 'Events',
	WEBINARS: 'Webinars',
	VIDEOS: 'Videos',
	VIDEO_ROLLS: 'Video Rolls',
	SURVEYS: 'Surveys',
	RELATED_WORK: 'External Links and Uploads',
	LTI: 'LTI Tools',
	READINGS: 'Readings',
	SCORM: 'SCORM Packages',
};

const MIME_TYPES_MAP = {
	[TYPES.ASSIGNMENTS]: [
		Assignment.MimeType,
		TimedAssignment.MimeType,
		DiscussionAssignment.MimeType,
	],
	[TYPES.EVENTS]: [CourseCalendarEvent.MimeType],
	[TYPES.RELATED_WORK]: [RelatedWorkReference.MimeType],
	[TYPES.LTI]: [LTIExternalToolAsset.MimeType],
	[TYPES.READINGS]: [
		'application/vnd.nextthought.persistentcontentpackage',
		Package.MimeType,
		RenderablePackage.MimeType,
	],
	[TYPES.SURVEYS]: [SurveyReference.MimeType, Survey.MimeType],
	[TYPES.VIDEOS]: [VideoRoll.MimeType, ...Video.MimeTypes],
	[TYPES.WEBINARS]: [WebinarAsset.MimeType],
	[TYPES.SCORM]: [SCORMContentInfo.MimeType],
};

export default class CourseAdminCompletionStore extends Stores.SimpleStore {
	constructor() {
		super();

		this.set({
			loading: true,
			defaultRequirables: Object.keys(MIME_TYPES_MAP).map(k => {
				return {
					label: k,
					isDefault: false,
				};
			}),
		});
	}

	async saveDefaultPolicy(label, value) {
		let defaultRequirables = [...(this.get('defaultRequirables') || [])];

		for (let i in defaultRequirables) {
			if (defaultRequirables[i].label === label) {
				defaultRequirables[i].isDefault = value;
			}
		}

		// this will emit the change so the widget updates immediately, but if there is an error, the widget will revert
		this.set('defaultRequirables', defaultRequirables);

		try {
			let types = defaultRequirables.reduce(
				(acc, a) =>
					acc.concat(a.isDefault ? MIME_TYPES_MAP[a.label] : []),
				[]
			);

			await this.course.CompletionPolicy.putToLink(
				DEFAULT_REQUIRED_POLICY_LINKS.UPDATEDEFAULT,
				{ mime_types: types }
			);
		} catch (e) {
			this.set('error', e.message || e);

			// reload to make sure we're synced with the server
			this.load(this.course, true);
		}
	}

	async save(completable, percentage, certificationPolicy) {
		const service = await getService();

		// optimistically emit changes so controls widgets update their state immediately
		// if there is an error, we'll revert and emit the old values with the error
		this.set({ completable, certificationPolicy });

		try {
			if (completable) {
				await service.put(this.course.getLink('CompletionPolicy'), {
					MimeType:
						'application/vnd.nextthought.completion.aggregatecompletionpolicy',
					percentage: percentage ? percentage / 100.0 : 0,
					offers_completion_certificate: Boolean(
						certificationPolicy?.offersCompletionCertificate
					),
					certificate_renderer_name:
						certificationPolicy?.certificateRendererName ??
						'default',
				});
			} else {
				// delete from CompletionPolicy?
				const encodedID = encodeURIComponent(this.course.NTIID);

				await service.delete(
					this.course.getLink('CompletionPolicy') + '/' + encodedID
				);
			}

			await this.course.refresh();

			this.load(this.course, true);
		} catch (e) {
			this.set('error', e.message || e);

			// reload to make sure we're synced with the server
			this.load(this.course, true);
		}
	}

	isTypeDefault(obj, type) {
		const mimeTypes = obj.mimeTypes || obj['mime_types'];

		return (
			!type ||
			(MIME_TYPES_MAP[type] || []).some(t => mimeTypes.includes(t))
		);
	}

	async load(course, skipLoad) {
		this.course = course;

		if (!skipLoad) {
			this.set('loading', true);
		}

		this.emitChange('loading');

		const service = await getService();

		const { CatalogEntry } = course;
		const certificateRenderers = (
			await CatalogEntry.fetchLink({
				mode: 'raw',
				rel: 'CertificateRenderers',
			})
		).terms.map(({ value }) => value);

		let state = {
			completable: false,
			certificationPolicy: {
				offersCompletionPolicy: false,
			},
			certificateRenderers,
			percentage: 0.0,
			disabled: !CatalogEntry || !CatalogEntry.hasLink('edit'),
			defaultRequiredDisabled: false,
			completableToggleDisabled: !this.course.hasLink(
				DEFAULT_REQUIRED_POLICY_LINKS.RESET
			),
			updateDisabled: !this.course.hasLink(
				DEFAULT_REQUIRED_POLICY_LINKS.UPDATE
			),
		};

		if (this.course.CompletionPolicy) {
			if (
				this.course.CompletionPolicy.hasLink(
					DEFAULT_REQUIRED_POLICY_LINKS.FETCH
				)
			) {
				const policy = await service.get(
					this.course.CompletionPolicy.getLink(
						DEFAULT_REQUIRED_POLICY_LINKS.FETCH
					)
				);

				state.defaultRequirables = Object.keys(MIME_TYPES_MAP).map(
					label => ({
						label,
						isDefault: this.isTypeDefault(policy, label),
					})
				);
			}

			if (
				!this.course.CompletionPolicy.hasLink(
					DEFAULT_REQUIRED_POLICY_LINKS.UPDATEDEFAULT
				)
			) {
				state.defaultRequiredDisabled = true;
			}

			state.completable = true;
			state.certificationPolicy = this.course.CompletionPolicy;
			state.percentage =
				(this.course.CompletionPolicy.percentage || 0) * 100;
		} else {
			// no completion policy, no default requirables either
			let defaultRequirables = [];

			for (let k of Object.keys(MIME_TYPES_MAP)) {
				defaultRequirables.push({
					label: k,
					isDefault: false,
				});
			}

			state.defaultRequirables = defaultRequirables;
		}

		state.loading = false;

		this.set(state);
	}
}
