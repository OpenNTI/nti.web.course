import {decorate} from '@nti/lib-commons';
import {Stores, Mixins} from '@nti/lib-store';
import {getService} from '@nti/web-client';
import {mixin} from '@nti/lib-decorators';

const BATCH_SIZE = 20;

class CourseSelectorStore extends Stores.BoundStore {
	constructor () {
		super();

		this.set({
			loading: true,
			error: null,
			courses: null,
			hasMore: false,
			loadingMore: false,
			errorLoadingMore: null
		});
	}


	async load () {
		//TODO: check the binding to see how to load the courses. For now
		//just load the catalog

		this.set({
			loading: true,
			error: null,
			courses: null,
			hasMore: false,
			loadingMore: false,
			errorLoadingMore: null
		});

		const params = {batchSize: BATCH_SIZE, batchStart: 0};

		if (this.searchTerm) {
			params.filter = this.searchTerm;
		}

		try {
			const service = await getService();
			const collection = this.binding;
			const catalog = service.getCollection(collection, 'Courses');

			if(!catalog) {
				this.set({
					loading: false,
					courses: [],
					loadMoreLink: false,
					hasMore: false
				});

				return;
			}

			const batch = await service.getBatch(catalog.href, params);

			//if the search term has changed out from under us
			if ((params.filter || this.searchTerm) && params.filter !== this.searchTerm) { return; }

			this.set({
				loading: false,
				courses: [...batch.Items],
				loadMoreLink: batch.getLink('batch-next'),
				hasMore: batch.hasLink('batch-next')
			});
		} catch (e) {
			this.set({
				loading: false,
				error: e
			});
		}
	}

	applySearchTerm () {
		this.set({loading: true});
		this.emitChange('searchTerm');
	}

	async loadMore () {
		const courses = this.get('courses');
		const link = this.get('loadMoreLink');

		if (!link) { return; }

		this.set({
			loadingMore: true,
			errorLoadingMore: null
		});

		try {
			const service = await getService();
			const batch = await service.getBatch(link);
			const items = batch ? batch.Items : [];

			if (!this.get('loadingMore')) { return; }

			this.set({
				loadingMore: false,
				courses: [...courses, ...items],
				loadMoreLink: batch && batch.getLink('batch-next'),
				hasMore: batch && batch.hasLink('batch-next')
			});
		} catch (e) {
			this.set({
				loadingMore: false,
				errorLoadingMore: e
			});
		}
	}
}

export default decorate(CourseSelectorStore, [
	mixin(Mixins.Searchable)
]);
