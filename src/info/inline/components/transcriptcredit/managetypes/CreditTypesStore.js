import {Stores} from '@nti/lib-store';

export default class CreditTypesStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.set('types', null);
		this.set('loading', false);
	}

	async loadAllTypes () {
		this.set('loading', true);
		this.emitChange('loading');

		//TODO: Load available types from server
		const types = [
			{NTIID: 'nti_1', type: 'CEU', unit: 'hours', disabled: false},
			{NTIID: 'nti_2', type: 'Credit', unit: 'hours', disabled: true},
			{NTIID: 'nti_3', type: 'ECTS', unit: 'points', disabled: false},
			{NTIID: 'nti_4', type: 'PLM', unit: 'hours', disabled: false}
		];

		this.set('loading', false);
		this.set('types', types);
		this.emitChange('loading', 'types');
	}
}
