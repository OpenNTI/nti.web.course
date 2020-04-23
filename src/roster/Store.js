import {getService} from '@nti/web-client';

import StreamedBatchStore from './StreamedBatchStore';

const DEFAULT_SIZE = 20;

function transformBatch (batch) {
	batch.Items = batch.Items.map(item => ({ ...item, MimeType: 'application/vnd.nextthought.courses.rosterenrollmentsummary'}));

	return batch;
}

export const KEYS = {
	...StreamedBatchStore.KEYS,
	COURSE: 'course',
	ENROLLMENT_SCOPES: 'enrollmentScopes',
	ROSTER_SUMMARY: 'rosterSummary',
	ROSTER_SUMMARY_ERROR: 'rosterSummaryError',
	LOADING: 'loading'
};

// Map the enrollment count keys to the server-expected filter values.
// note that this is NOT the final translation for display in the UI;
// The value here will/should be localized by UI components
const scopeNames = {
	TotalLegacyForCreditEnrolledCount: 'ForCredit',
	TotalLegacyOpenEnrolledCount: 'Public'
};
const mapScopeName = name => scopeNames[name] || name;

export default class CourseRosterStore extends StreamedBatchStore {
	constructor () {
		super();

		this.set(KEYS.SEARCH_TERM, null);
	}

	get hasCourse () {
		return !!this.get(KEYS.COURSE);
	}

	loadCourse (course, options) {
		if (this.get(KEYS.COURSE) === course) { return; }

		this.clearBatches();
		this.set(KEYS.COURSE, course);

		this.setHref(course.getLink('CourseEnrollmentRoster'));
		this.addOptions({
			batchSize: DEFAULT_SIZE,
			batchStart: 0,
			...(options || {})
		});

		this.loadSummary();
		this.load();
	}

	async loadBatch (href, options) {
		const service = await getService();

		return service.getBatch(href, options, transformBatch);
	}

	async loadSummary () {
		const course = this.get(KEYS.COURSE);

		try {
			const summary = await course.getRosterSummary();
			this.set(KEYS.ROSTER_SUMMARY, summary);


			// filter scopes with zero count and remap legacy scope names
			const scopes = Object.entries(summary.TotalEnrollmentsByScope)
				.reduce((acc, [scope, count]) => !count ? acc : {...acc, [mapScopeName(scope)]: count} , {});

			this.set(KEYS.ENROLLMENT_SCOPES, scopes);
		}
		catch (e) {
			this.set(KEYS.ROSTER_SUMMARY_ERROR, e);
		}
	}

	updateSearchTerm (term) {
		const {SEARCH_TERM: key} = KEYS;

		this.addOptionsBuffered({
			[key]: term
		});
	}
}
