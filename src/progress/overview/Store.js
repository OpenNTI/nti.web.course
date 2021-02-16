import { Stores } from '@nti/lib-store';
import { getService } from '@nti/web-client';

export default class ProgressOverviewStore extends Stores.SimpleStore {
	constructor() {
		super();

		this.set({
			loading: false,
			error: null,
			currentItem: null,
			totalItems: null,
			currentItemIndex: null,
			hasNextItem: false,
			hasPrevItem: false,
		});
	}

	loadNextItem() {
		if (this.nextLink) {
			this.loadBatchLink(this.nextLink);
		}
	}

	loadPrevItem() {
		if (this.prevLink) {
			this.loadBatchLink(this.prevLink);
		}
	}

	async loadBatchLink(batchLink) {
		this.nextLink = null;
		this.prevLink = null;

		this.set({
			loading: true,
			error: null,
			currentItem: null,
			hasNextItem: false,
			hasPrevItem: false,
		});

		try {
			const service = await getService();
			const batch = await service.getBatch(batchLink);
			const {
				Items,
				FilteredTotalItemCount,
				TotalItemCount,
				BatchPage,
			} = batch;
			const total =
				FilteredTotalItemCount != null
					? FilteredTotalItemCount
					: TotalItemCount;

			this.batch = batch;
			this.nextLink = batch.getLink('batch-next');
			this.prevLink = batch.getLink('batch-prev');

			this.set({
				loading: false,
				currentItem: Items[0],
				currentItemIndex: BatchPage,
				totalItems: total,
				hasNextItem: !!this.nextLink && BatchPage < total,
				hasPrevItem: !!this.prevLink,
			});
		} catch (e) {
			this.set({
				loading: false,
				error: e,
			});
		}
	}

	loadCourse(enrollment, course) {
		this.set({
			currentItem: enrollment,
			currentItemIndex: 1,
			totalItems: 1,
			hasNextItem: false,
			hasPrevItem: false,
		});
	}
}
