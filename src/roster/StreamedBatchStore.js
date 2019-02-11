import {Stores, Mixins} from '@nti/lib-store';
import {mixin} from '@nti/lib-decorators';

const Load = Symbol('load');

const OPTIONS = 'options';
const FILTER = 'filter';
const BATCH_START = 'batchStart';
const SEARCH_TERM = 'usernameSearchTerm';
const SORT_ON = 'sortOn';
const SORT_ORDER = 'sortOrder';

const triggersReload = [
	FILTER,
	SEARCH_TERM,
	SORT_ON,
	SORT_ORDER
];

export default
@mixin(Mixins.Searchable)
class StreamedBatchStore extends Stores.BoundStore {
	constructor () {
		super();

		this.set('batches', null);
		this.set(OPTIONS, {});
		this.set('href', null);

		this.set('loading', false);
		this.set('error', null);
	}

	static KEYS = {
		OPTIONS,
		FILTER,
		BATCH_START,
		SEARCH_TERM
	}

	get batchSize () {
		return this.getOption('batchSize');
	}

	get firstBatch () {
		const [batch] = (this.get('batches') || []);
		return batch;
	}

	get lastBatch () {
		const [batch] = (this.get('batches') || []).slice(-1);
		return batch;
	}

	get hasNextPage () {
		const {batchSize, lastBatch, lastBatch: {Items: items} = {}} = this;

		//If we have items, check that the last batch has as many items as we requested
		return (items && items.length >= batchSize) && !!getNextLink(lastBatch);
	}


	get hasPrevPage () {
		return !!getPrevLink(this.firstBatch);
	}


	get items () {
		const batches = this.get('batches');

		return batches ? batches.reduce((r, {Items}) => [...r, ...Items], []) : null;
	}

	get sortedOn () {
		return this.getOption(SORT_ON);
	}

	get sortedOrder () {
		return this.getOption(SORT_ORDER);
	}

	setHref (href) {
		this.set('href', href);

		//If we already have a batch re-load
		if (this.lastBatch) {
			this.load();
		}
	}

	getOption = key => (this.get(OPTIONS) || {})[key];

	addOptions (newOptions) {
		const options = this.get(OPTIONS);
		const reload = this.requiresReload(newOptions);

		this.set(OPTIONS, {...options, ...newOptions});
		
		if (reload) {
			this.clearBatches();
			this.load();
		}
	}

	requiresReload (newOptions) {
		const options = this.get(OPTIONS);
		return triggersReload.some(option => (
			newOptions[option] != null // has an option that triggers a reload…
			&& newOptions[option] !== options[option] // …and it's not the value we already have
		));
	}

	clearBatches = () => {
		this.set('batches', undefined);
		this.addOptions({
			[BATCH_START]: 0
		});
	}

	removeOption (option) {
		const options = this.get(OPTIONS);

		if (options[option] != null) {
			delete options[option];

			if (triggersReload.includes(option)) {
				this.clearBatches();
				this.load();
			}
		}
	}


	async [Load] (href, options = {}) {
		this.set('loading', true);
		this.emitChange('loading');
		const batches = this.get('batches');

		const searchTerm = this.searchTerm;

		try {
			const batch = href ? await this.loadBatch(href, options) : { Items: [] };

			if(this.searchTerm !== searchTerm) {
				return;
			}

			this.set({
				batches: [...(batches || []), batch],
				loading: false
			});
		} catch (e) {
			this.set({
				error: e,
				loading: false
			});
		}
	}


	load () {
		this[Load](this.get('href'), this.get('options'));
	}


	// reload () {
	// 	this.set('batches', undefined);
	// 	this[Load]();
	// }


	loadNextPage () {
		if (!this.hasNextPage) { return; }

		this[Load](getNextLink(this.lastBatch));
	}


	// loadPrevPage () {
	// 	if (!this.hasPrevPage) { return; }

	// 	this[Load](getPrevLink(this.get('batch')));
	// }


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
	return batch && batch.getLink && batch.getLink('batch-next');
}


function getPrevLink (batch) {
	return batch && batch.getLink && batch.getLink('batch-prev');
}
