import { decorate, url } from '@nti/lib-commons';
import { Stores, Mixins } from '@nti/lib-store';
import { mixin } from '@nti/lib-decorators';

import { stripEmptyProperties } from './util';

/** @typedef {import('@nti/lib-interfaces').Batch} Batch */

const Load = Symbol('load');

const OPTIONS = 'options';
const FILTER = 'filter';
const BATCH_START = 'batchStart';
const SEARCH_TERM = 'usernameSearchTerm';
const SORT_ON = 'sortOn';
const SORT_ORDER = 'sortOrder';

const triggersReload = [FILTER, SEARCH_TERM, SORT_ON, SORT_ORDER];

const hasProperty = (x, k) => Object.prototype.hasOwnProperty.call(x, k);

class StreamedBatchStore extends Stores.BoundStore {
	constructor() {
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
		SEARCH_TERM,
	};

	get batchSize() {
		return this.getOption('batchSize');
	}

	get firstBatch() {
		const [batch] = this.get('batches') || [];
		return batch;
	}

	get lastBatch() {
		const [batch] = (this.get('batches') || []).slice(-1);
		return batch;
	}

	get hasNextPage() {
		const { batchSize, lastBatch, lastBatch: { Items: items } = {} } = this;

		//If we have items, check that the last batch has as many items as we requested
		return items && items.length >= batchSize && !!getNextLink(lastBatch);
	}

	get hasPrevPage() {
		return !!getPrevLink(this.firstBatch);
	}

	get items() {
		const batches = this.get('batches');

		return batches
			? batches.reduce((r, { Items }) => [...r, ...Items], [])
			: null;
	}

	batchLinkFor = item => {
		const batch = (this.get('batches') || []).find(
			({ Items: items = [] }) => items.includes(item)
		);

		if (batch) {
			const { href, Items: items } = batch;
			const index = items.indexOf(item);
			const _url = url.parse(href);

			const batchStart = parseInt(
				_url.searchParams.get('batchStart') || 0,
				10
			);

			_url.searchParams.set('batchStart', batchStart + index);
			_url.searchParams.set('batchSize', 1);

			return `${_url.pathname}${_url.search}`;
		}
	};

	get filter() {
		return this.getOption(FILTER);
	}

	get sortedOn() {
		return this.getOption(SORT_ON);
	}

	get sortedOrder() {
		return this.getOption(SORT_ORDER);
	}

	setHref(href) {
		this.set('href', href);

		//If we already have a batch re-load
		if (this.lastBatch) {
			this.load();
		}
	}

	getOption = key => {
		const { pendingOptions } = this;
		const source =
			pendingOptions && hasProperty(pendingOptions, key)
				? pendingOptions
				: this.get(OPTIONS) || {};
		return source[key];
	};

	addOptionsBuffered = options => {
		this.pendingOptions = {
			...this.pendingOptions,
			...options,
		};

		clearTimeout(this.pendingOptionsTimeout);

		this.pendingOptionsTimeout = setTimeout(() => {
			this.addOptions(this.pendingOptions);
			delete this.pendingOptions;
		}, 300);
	};

	addOptions(newOptions) {
		const options = this.get(OPTIONS);
		const reload = this.requiresReload(newOptions);

		this.set(OPTIONS, stripEmptyProperties({ ...options, ...newOptions }));

		if (reload) {
			this.reload();
		}
	}

	requiresReload(newOptions = {}) {
		const options = this.get(OPTIONS);
		return triggersReload.some(
			option =>
				hasProperty(newOptions, option) && // has an option that triggers a reload…
				newOptions[option] !== options[option] && // …and it's not the value we already have…
				!(newOptions[option] == null && options[option] == null) // …and they're not both null-ish
		);
	}

	clearBatches = () => {
		this.set('batches', undefined);
		this.addOptions({
			[BATCH_START]: 0,
		});
	};

	removeOption(option) {
		const options = this.get(OPTIONS);

		if (options[option] != null) {
			delete options[option];

			if (triggersReload.includes(option)) {
				this.reload();
			}
		}
	}

	reload = () => {
		this.clearBatches();
		this.load();

		this.onReload?.();
	};

	async [Load](href, options = {}) {
		this.set('loading', true);
		this.emitChange('loading');
		const batches = this.get('batches');

		try {
			const batch = href
				? await this.loadBatch(href, options)
				: { Items: [] };

			// if options changed while we were awaiting the response, drop it on the floor.
			// the second condition is a little backwards--it's testing whether the old options
			// would trigger a reload, but it answers the question we're interested in.
			const { pendingOptions } = this;
			if (
				this.requiresReload(pendingOptions) ||
				this.requiresReload(options)
			) {
				return;
			}

			this.set({
				batches: [...(batches || []), batch],
				loading: false,
			});
		} catch (e) {
			this.set({
				error: e,
				loading: false,
			});
		}
	}

	load() {
		const batches = this.get('batches');

		if (batches && batches.length) {
			return;
		}

		this[Load](this.get('href'), this.get(OPTIONS));
	}

	// reload () {
	// 	this.set('batches', undefined);
	// 	this[Load]();
	// }

	loadNextPage() {
		if (!this.hasNextPage) {
			return;
		}

		this[Load](getNextLink(this.lastBatch));
	}

	// loadPrevPage () {
	// 	if (!this.hasPrevPage) { return; }

	// 	this[Load](getPrevLink(this.get('batch')));
	// }

	/**
	 * Provide a method to load a batch given a href and options
	 *
	 * @abstract
	 * @param  {string} href    the href of the batch to load
	 * @param  {Object} options the options to load the batch with
	 * @returns {Promise<Batch>}         fulfills with a batch model
	 */
	loadBatch(href, options) {}
}

export default decorate(StreamedBatchStore, [mixin(Mixins.Searchable)]);

function getNextLink(batch) {
	return batch && batch.getLink && batch.getLink('batch-next');
}

function getPrevLink(batch) {
	return batch && batch.getLink && batch.getLink('batch-prev');
}
