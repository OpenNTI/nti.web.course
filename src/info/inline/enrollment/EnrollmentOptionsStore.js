import {Stores} from '@nti/lib-store';

export default class EnrollmentOptionsStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.set('enrollmentOptions', null);
		this.set('availableOptions', null);
		this.set('error', null);
		this.set('loading', false);
	}

	async removeOption (option) {
		this.set('loading', true);
		this.emitChange('loading');

		try {
			await option.delete();

			this.loadEnrollmentOptions(this.catalogEntry);
		}
		catch (e) {
			this.set('error', e.message);
			this.set('loading', false);

			this.emitChange('error', 'loading');
		}
	}

	addEnrollmentOption = async (params) => {
		this.set('loading', true);
		this.set('error', false);
		this.emitChange('loading', 'error');

		try {
			await this.catalogEntry.putToLink('EnrollmentOptions', params);

			await this.loadEnrollmentOptions(this.catalogEntry);
		}
		catch (e) {
			this.set('error', e.message);
			this.set('loading', false);

			this.emitChange('error', 'loading');
		}
	}

	updateEnrollmentOption = async (option, params) => {
		this.set('loading', true);
		this.emitChange('loading');

		try {
			await option.save(params);

			this.loadEnrollmentOptions(this.catalogEntry);
		}
		catch (e) {
			this.set('error', e.message);
			this.set('loading', false);

			this.emitChange('error', 'loading');
		}
	}

	getError () {
		return this.get('error');
	}

	async loadEnrollmentOptions (catalogEntry) {
		if(!catalogEntry) {
			return;
		}

		if(!this.catalogEntry || catalogEntry.getID() !== this.catalogEntry.getID()) {
			this.catalogEntry = catalogEntry;
		}

		this.set('loading', true);
		this.emitChange('loading');

		await this.catalogEntry.refresh();

		const optionsContainer = await this.catalogEntry.fetchLinkParsed('EnrollmentOptions');

		const availableOptions = optionsContainer.AvailableEnrollmentOptions;
		const existingOptions = this.catalogEntry.getEnrollmentOptions();

		const itemsFromContainer = optionsContainer.Items;

		const existingTypes = Object.keys(existingOptions.Items).map(x => existingOptions.Items[x].MimeType);

		const enrollmentOptions = Object.keys(existingOptions.Items)
			.map(x => existingOptions.Items[x]) // convert to array
			.map(x => {
				// pull item from container items if it exists
				if(itemsFromContainer) {
					const item = itemsFromContainer.filter(y => y.MimeType === x.MimeType)[0];

					if(item) {
						return item;
					}
				}

				return x;
			});

		const availableOptionsFiltered = availableOptions.filter(x => !existingTypes.includes(x.MimeType)); // don't allow adding types that already exist

		this.set('enrollmentOptions', enrollmentOptions);
		this.set('availableOptions', availableOptionsFiltered);
		this.set('loading', false);

		this.emitChange('enrollmentOptions', 'availableOptions', 'loading');
	}
}
