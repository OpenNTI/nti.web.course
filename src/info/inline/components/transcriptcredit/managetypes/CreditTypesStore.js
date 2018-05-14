import {Stores} from '@nti/lib-store';
import {getService} from '@nti/web-client';
import {scoped} from '@nti/lib-locale';

const t = scoped('course.info.inline.components.transcriptcredit.managetypes.CreditTypeStore', {
	tooShortError: '%(field)s is required'
});

const FIELD_MAP = {
	'credit_type': 'Type',
	'credit_units': 'Unit'
};

export default class CreditTypesStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.set('types', null);
		this.set('loading', false);
		this.set('error', null);
	}

	async removeValues (values) {
		if(!values || values.length === 0) {
			return;
		}

		const service = await getService();

		try {
			const requests = values.map(d => {
				const deleteLink = d && d.Links && d.Links.filter(l => l.rel === 'delete')[0];

				if(!deleteLink) {
					return Promise.reject('No delete link');
				}

				return service.delete(deleteLink.href);
			});

			await Promise.all(requests);

			await this.loadAllTypes();
		}
		catch (e) {
			this.set('error', this.makeNiceError(e));
			this.set('loading', false);
			this.emitChange('error', 'loading');

			return;
		}
	}

	makeNiceError (e) {
		if(e.code === 'TooShort') {
			return t('tooShortError', {field: FIELD_MAP[e.field]});
		}

		return e.message || e;
	}

	async saveValues (values) {
		if(!values) {
			return;
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

					return service.put(editLink.href, d);
				});

				await Promise.all(requests);
			}

			if(newDefs || existing) {
				await this.loadAllTypes();
			}
		}
		catch (e) {
			this.set('error', this.makeNiceError(e));
			this.set('loading', false);
			this.emitChange('error', 'loading');

			return;
		}
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

		const allItems = this.get('types');

		const existing = defs.filter(x => x.NTIID).filter(def => {
			const match = allItems.filter(i => i.NTIID === def.NTIID)[0];

			return match.type !== def['credit_type'] || match.unit !== def['credit_units'];
		});

		return {
			newDefs: defs.filter(x => !x.NTIID),
			existing
		};
	}

	getTypes () {
		return this.get('types') || [];
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
