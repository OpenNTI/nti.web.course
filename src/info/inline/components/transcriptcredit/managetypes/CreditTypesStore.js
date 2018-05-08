import {Stores} from '@nti/lib-store';
import {getService} from '@nti/web-client';

export default class CreditTypesStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.set('types', null);
		this.set('loading', false);
		this.set('error', null);
	}

	async saveValues (values) {
		if(!values) {
			return Promise.resolve();
		}

		this.set('loading', true);
		this.set('error', null);
		this.emitChange('loading');

		const {newDefs, existing} = this.buildDefinitions(values);

		const service = await getService();
		const defsCollection = service.getCollection('CreditDefinitions', 'Global');

		try {
			if(newDefs) {
				// PUT to collection link
				const requests = newDefs.map(d => {
					return service.put(defsCollection.href, d);
				});

				await Promise.all(requests);
			}

			if(existing) {
				// PUT to NTIID of def
				const requests = existing.map(d => {
					const editLink = d && d.Links && d.Links.filter(l => l.rel === 'edit')[0];

					if(!editLink) {
						return Promise.reject('No edit link');
					}

					return service.putToLink(editLink, d);
				});

				await Promise.all(requests);
			}
		}
		catch (e) {
			this.set('error', e.message || e);
			this.set('loading', false);
			this.emitChange('error', 'loading');

			return Promise.resolve();
		}

		await this.loadAllTypes();
	}

	buildDefinitions (values) {
		const defs = values && values.map(v => {
			let def = {
				Links: v.Links,
				'credit_type': v.type,
				'credit_units': v.unit,
				MimeType: 'application/vnd.nextthought.credit.creditdefinition'
			};

			if(v.NTIID) {
				def.NTIID = v.NTIID;
			}

			return def;
		});

		if(!defs) {
			return {};
		}

		return {
			'newDefs': defs.filter(x => !x.NTIID),
			'existing': defs.filter(x => x.NTIID)
		};
	}

	getTypesAsStrings () {
		return (this.get('types') || []).map(t => (t.type + ' ' + t.unit));
	}

	async loadAllTypes () {
		this.set('loading', true);
		this.emitChange('loading');

		const service = await getService();

		const defsCollection = service.getCollection('CreditDefinitions', 'Global');

		if(defsCollection) {
			const existingTypes = await service.getBatch(defsCollection.href);

			if(existingTypes) {
				this.set('loading', false);
				this.set('types', existingTypes.Items);
				this.emitChange('loading', 'types', 'error');
			}
			else {
				this.set('loading', false);
				this.set('types', []);
				this.emitChange('loading', 'types', 'error');
			}
		}
	}
}
