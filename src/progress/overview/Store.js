import {Stores} from '@nti/lib-store';
import {getService} from '@nti/web-client';

export default class ProgressOverviewStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.set('loading', false);
		this.set('error', null);
		this.set('currentItem', null);

		this.set('totalItems', null);
		this.set('currentItemIndex', null);
		this.set('hasNextItem', false);
		this.set('hasPrevItem', false);
	}


	loadNextItem () {
		if (this.nextLink) {
			this.loadBatchLink(this.nextLink);
		}
	}

	loadPrevItem () {
		if (this.prevLink) {
			this.loadBatchLink(this.prevLink);
		}
	}


	async loadBatchLink (batchLink) {
		this.nextLink = null;
		this.prevLink = null;

		this.set('loading', true);
		this.set('error', null);
		this.set('currentItem', null);
		this.set('hasNextItem', false);
		this.set('hasPrevItem', false);
		this.emitChange('loading');

		try {
			const service = await getService();
			const batch = await service.getBatch(batchLink);
			const {Items, FilteredTotalItemCount, TotalItemCount, BatchPage} = batch;
			const total = FilteredTotalItemCount != null ? FilteredTotalItemCount : TotalItemCount;

			this.batch = batch;
			this.nextLink = batch.getLink('batch-next');
			this.prevLink = batch.getLink('batch-prev');

			this.set('loading', false);
			this.set('currentItem', Items[0]);
			this.set('currentItemIndex', BatchPage);
			this.set('totalItems', total);
			this.set('hasNextItem', !!this.nextLink && BatchPage < total);
			this.set('hasPrevItem', !!this.prevLink);
			this.emitChange('currentItem', 'currentItemIndex', 'totalItems', 'hasNextItem', 'hasPrevItem');
		} catch (e) {
			this.set('loading', false);
			this.set('error', e);
			this.emitChange('error', 'loading');
		}
	}


	loadCourse (enrollment, course) {
		this.set('currentItem', enrollment);
		this.set('currentItemIndex', 1);
		this.set('totalItems', 1);
		this.set('hasNextItem', false);
		this.set('hasPrevItem', false);
		this.emitChange('currentItem', 'currentItemIndex', 'totalItems', 'hasNextItem', 'hasPrevItem');
	}
}
