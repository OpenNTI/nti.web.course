import { Stores } from 'nti-lib-store';

export default class LTIStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.set('loading', false);
		this.set('error', null);
		this.set('items', []);
		this.course = null;
	}

	async deleteItem (item) {
		await item.delete();
		this.loadItems();
	}

	async addItem (item) {
		await this.course.postToLink('lti-configured-tools', item);
		this.loadItems();
	}

	setCourse (course) {
		this.course = course;
		this.loadItems();
	}

	async loadItems () {
		this.set('loading', true);
		this.emitChange('loading');

		try {
			const items = await this.course.getLTIConfiguredTools();
			this.set('loading', false);
			this.set('items', items);
			this.emitChange('loading', 'items');
		} catch (error) {
			this.set('error', error);
			this.set('loading', false);
			this.emitChange('error', 'loading');
		}
	}

	itemChange (item) {
		const items = this.get('items');

		const newItems = items.map(x => x.NTIID === item.NTIID ? item : x);
		this.set('items', newItems);
		this.emitChange('items');
	}
}
