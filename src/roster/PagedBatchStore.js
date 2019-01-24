import {Stores, Mixins} from '@nti/lib-store';
import {mixin} from '@nti/lib-decorators';

const Load = Symbol('load');

const OPTIONS = 'options';
const FILTER = 'filter';
const BATCH_START = 'batchStart';

export default
@mixin(Mixins.Searchable)
class PagedBatchStore extends Stores.BoundStore {
	constructor () {
		super();

		this.set('batch', null);
		this.set(OPTIONS, {});
		this.set('href', null);

		this.set('loading', false);
		this.set('error', null);
	}

	static KEYS = {
		OPTIONS,
		FILTER,
		BATCH_START
	}

	get batchSize () {
		const options = this.get(OPTIONS);

		return options.batchSize;
	}


	get hasNextPage () {
		const {batchSize, items} = this;

		//If we have items, check that there are as many items as we requested
		return (items && items.length >= batchSize) && !!getNextLink(this.get('batch'));
	}


	get hasPrevPage () {
		return !!getPrevLink(this.get('batch'));
	}


	get items () {
		const batch = this.get('batch');

		return batch ? batch.Items : null;
	}

	get sortedOn () {
		return (this.get(OPTIONS) || {}).sortOn;
	}

	get sortedOrder () {
		return (this.get(OPTIONS) || {}).sortOrder;
	}

	setHref (href) {
		this.set('href', href);

		//If we already have a batch re-load
		if (this.get('batch')) {
			this.load();
		}
	}


	addOptions (newOptions) {
		const options = this.get(OPTIONS);

		this.set(OPTIONS, {...options, ...newOptions});

		//If we already have a batch re-load
		if (this.get('batch')) {
			this.load();
		}
	}


	removeOption (option) {
		const options = this.get(OPTIONS);

		delete options[option];

		//If we already have a batch re-load
		if (this.get('batch')) {
			this.load();
		}
	}


	async [Load] (href, options = {}) {
		this.set('loading', true);
		this.emitChange('loading');

		const searchTerm = this.searchTerm;

		try {
			const batch = href ? await this.loadBatch(href, options) : { Items: [] };

			if(this.searchTerm !== searchTerm) {
				return;
			}

			this.set('batch', batch);
			this.set('loading', false);
			this.emitChange('items', 'hasNextPage', 'hasPrevPage', 'loading');
		} catch (e) {
			this.set('error', e);
			this.set('loading', false);
			this.emitChange('error', 'loading');
		}
	}


	load () {
		this[Load](this.get('href'), this.get('options'));
	}


	reload () {
		const batch = this.get('batch');

		this[Load](batch.href);
	}


	loadNextPage () {
		if (!this.hasNextPage) { return; }

		this[Load](getNextLink(this.get('batch')));
	}


	loadPrevPage () {
		if (!this.hasPrevPage) { return; }

		this[Load](getPrevLink(this.get('batch')));
	}


	/**
   * Provide a method to load a batch given a href and options
   *
   * @override
   * @param  {String} href    the href of the batch to load
   * @param  {Object} options the options to load the batch with
   * @return {Promise}         fulfills with a batch model
   */
	loadBatch (href, options) {}
}


function getNextLink (batch) {
	return batch && batch.getLink('batch-next');
}


function getPrevLink (batch) {
	return batch && batch.getLink('batch-prev');
}
