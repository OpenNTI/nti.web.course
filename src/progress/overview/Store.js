import {Stores} from 'nti-lib-store';

export default class ProgressOverviewStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.set('enrollment', null);

		this.set('totalItems', null);
		this.set('currentItemIndex', null);
		this.set('hasNextPage', false);
		this.set('hasPrevPage', false);
	}

	loadBatch (batch) {

	}


	loadCourse (course) {
		this.set('enrollment', course.PreferredAccess);
		this.set('totalItems', 1);
		this.set('currentItemIndex', 1);
		this.set('hasNextPage', false);
		this.set('hasPrevPage', false);
	}
}
