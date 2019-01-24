import {getService} from '@nti/web-client';

import PagedBatchStore from './PagedBatchStore';

const DEFAULT_SIZE = 20;

function transformBatch (batch) {
	batch.Items = batch.Items.map(item => ({ ...item, MimeType: 'application/vnd.nextthought.courses.rosterenrollmentsummary'}));

	return batch;
}

export const KEYS = {
	...PagedBatchStore.KEYS,
	SEARCH_TERM: 'searchTerm',
	COURSE: 'course',
	ROSTER_SUMMARY: 'rosterSummary',
	ROSTER_SUMMARY_ERROR: 'rosterSummaryError',
	LOADING: 'loading'
};

export default class CourseRosterStore extends PagedBatchStore {
	constructor () {
		super();

		this.set(KEYS.SEARCH_TERM, null);
	}

	get hasCourse () {
		return !!this.get(KEYS.COURSE);
	}

	loadCourse (course) {
		if (this.get(KEYS.COURSE) === course) { return; }

		this.set(KEYS.COURSE, course);

		this.setHref(course.getLink('CourseEnrollmentRoster'));
		this.addOptions({batchSize: DEFAULT_SIZE, batchStart: 0});

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
		}
		catch (e) {
			this.set(KEYS.ROSTER_SUMMARY_ERROR, e);
		}
	}


	updateSearchTerm (term) {
		this.set(KEYS.SEARCH_TERM, term);
		this.set(KEYS.LOADING, true);
		this.emitChange(KEYS.LOADING, KEYS.SEARCH_TERM);

		clearTimeout(this.doSearchTimeout);

		if (!term) {
			this.removeOption('usernameSearchTerm');
		} else {
			this.doSearchTimeout = setTimeout(() => {
				this.addOptions({
					usernameSearchTerm: encodeURIComponent(term)
				});
			}, 300);
		}
	}

	// async loadInitial () {
	// 	const course = this.get('course');
	// 	const service = await getService();
	// 	const roster = await service.getBatch(course.getLink('CourseEnrollmentRoster'), {batchSize: DEFAULT_SIZE, batchStart: 0});

	// 	return convertBatch(roster);
	// }


	// async loadSearchTerm (term) {
	// 	const course = this.get('course');
	// 	const service = await getService();
	// 	const roster = await service.getBatch(
	// 		course.getLink('CourseEnrollmentRoster'),
	// 		{
	// 			batchSize: DEFAULT_SIZE,
	// 			batchStart: 0,
	// 			usernameSearchTerm: encodeURIComponent(term)
	// 		}
	// 	);

	// 	return convertBatch(roster);
	// }
}
