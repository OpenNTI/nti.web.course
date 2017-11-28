import {getService} from 'nti-web-client';
import {Stores} from 'nti-lib-store';

const DEFAULT_SIZE = 10;


function convertBatch (batch) {
	const link = batch.getLink('batch-next');
	const loadNext = !link ?
		null :
		async () => {
			const service = await getService();
			const nextBatch = await service.getBatch(link);

			return convertBatch(nextBatch);
		};

	return {
		items: batch.Items,
		loadNext
	};
}


export default class CourseRosterStore extends Stores.SearchablePagedStore {
	get hasCourse () {
		return !!this.get('course');
	}

	loadCourse (course) {
		if (this.get('course') === course) { return; }

		this.set('course', course);

		this.load();
	}

	async loadInitial () {
		const course = this.get('course');
		const service = await getService();
		const roster = await service.getBatch(course.getLink('CourseEnrollmentRoster'), {batchSize: DEFAULT_SIZE, batchStart: 0});

		return convertBatch(roster);
	}


	async loadSearchTerm (term) {
		const course = this.get('course');
		const service = await getService();
		const roster = await service.getBatch(
			course.getLink('CourseEnrollmentRoster'),
			{
				batchSize: DEFAULT_SIZE,
				batchStart: 0,
				usernameSearchTerm: encodeURIComponent(term)
			}
		);

		return convertBatch(roster);
	}
}
