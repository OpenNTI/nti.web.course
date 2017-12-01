import {getService} from 'nti-web-client';
import {Stores} from 'nti-lib-store';

const DEFAULT_SIZE = 20;

function transformBatch (batch) {
	batch.Items = batch.Items.map(item => ({ ...item, MimeType: 'application/vnd.nextthought.courses.rosterenrollmentsummary'}));

	return batch;
}

export default class CourseRosterStore extends Stores.PagedBatchStore {
	constructor () {
		super();

		this.set('searchTerm', null);
	}

	get hasCourse () {
		return !!this.get('course');
	}

	loadCourse (course) {
		if (this.get('course') === course) { return; }

		this.set('course', course);

		this.setHref(course.getLink('CourseEnrollmentRoster'));
		this.addOptions({batchSize: DEFAULT_SIZE, batchStart: 0});

		this.load();
	}

	async loadBatch (href, options) {
		const service = await getService();

		return service.getBatch(href, options, transformBatch);
	}


	updateSearchTerm (term) {
		this.set('searchTerm', term);
		this.set('loading', true);
		this.emitChange('loading', 'searchTerm');

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
