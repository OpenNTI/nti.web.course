import {Stores} from 'nti-lib-store';

export default class ProgressOverviewStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.set('currentItem', null);

		this.set('totalItems', null);
		this.set('currentItemIndex', null);
		this.set('hasNextPage', false);
		this.set('hasPrevPage', false);
	}

	loadBatch (batch) {

	}


	loadCourse (enrollment, course) {
		this.set('currentItem', enrollment);
		this.set('currentItemIndex', 1);
		this.set('totalItems', 1);
		this.set('hasNextPage', false);
		this.set('hasPrevPage', false);
	}
}
