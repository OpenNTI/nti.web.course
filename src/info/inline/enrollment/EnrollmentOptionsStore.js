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

	async toggleOpenEnrollment (allow) {
		if(this.courseInstance) {
			const payload = {...this.vendorInfo};

			if(!payload.NTI) {
				payload.NTI = {DenyOpenEnrollment: !allow};
			}
			else {
				payload.NTI.DenyOpenEnrollment = !allow;
			}

			await this.courseInstance.putToLink('VendorInfo', payload);

			await this.loadEnrollmentOptions(this.catalogEntry, this.courseInstance, true);
		}
	}

	async loadEnrollmentOptions (catalogEntry, courseInstance, skipLoadingMask) {
		if(!catalogEntry) {
			return;
		}

		if(!this.catalogEntry || catalogEntry.getID() !== this.catalogEntry.getID()) {
			this.catalogEntry = catalogEntry;
			this.courseInstance = courseInstance;
		}

		if(!skipLoadingMask) {
			this.set('loading', true);
			this.emitChange('loading');
		}

		await this.catalogEntry.refresh();

		const vendorInfo = await courseInstance.fetchLink('VendorInfo');

		this.vendorInfo = vendorInfo;

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

		const openEnroll = enrollmentOptions.filter(x => x.MimeType.match(/openenrollment/));
		const allowOpenEnrollment = openEnroll[0] && openEnroll[0].enabled;

		this.set('enrollmentOptions', enrollmentOptions);
		this.set('availableOptions', availableOptionsFiltered);
		this.set('allowOpenEnrollment', allowOpenEnrollment);
		this.set('loading', false);

		this.emitChange('enrollmentOptions', 'availableOptions', 'allowOpenEnrollment', 'loading');
	}
}
