import {Stores} from 'nti-lib-store';
import {getService} from 'nti-web-client';

export default class ProgressOverviewStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.set('currentItem', null);

		this.set('totalItems', null);
		this.set('currentItemIndex', null);
		this.set('hasNextItem', false);
		this.set('hasPrevItem', false);
	}


	async loadNextItem () {
		const service = await getService();
		const batch = await service.getBatch(this.nextLink);

		this.loadBatch(batch);
	}

	async loadPrevItem () {
		const service = await getService();
		const batch = await service.getBatch(this.prevLink);

		this.loadBatch(batch);
	}


	loadBatch (batch) {
		const {Items, TotalItemCount, BatchPage} = batch;

		this.batch = batch;
		this.nextLink = batch.getLink('batch-next');
		this.prevLink = batch.getLink('batch-prev');

		this.set('currentItem', Items[0]);
		this.set('currentItemIndex', BatchPage);
		this.set('totalItems', TotalItemCount);
		this.set('hasNextItem', !!this.nextLink);
		this.set('hasPrevItem', !!this.prevLink);
	}


	loadCourse (enrollment, course) {
		this.set('currentItem', enrollment);
		this.set('currentItemIndex', 1);
		this.set('totalItems', 1);
		this.set('hasNextItem', false);
		this.set('hasPrevItem', false);
	}
}
