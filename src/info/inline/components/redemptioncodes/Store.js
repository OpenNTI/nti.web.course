import { Stores } from '@nti/lib-store';

export default class CodeStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.set('loading', false);
		this.set('error', null);
		this.set('items', []);
		this.course = null;
	}

	setCourse (course) {
		this.course = course;
		this.loadItems();
	}

	async createItem () {
		try {
			const item = await this.course.postToLink('CreateCourseInvitation', null, true);
			const items = this.get('items') || [];

			this.set('items', [...items, item]);
			this.emitChange('items');
		} catch (err) {
			const defaultError = 'There was an error with creating a code.';

			if (err) {
				const error = typeof err === 'string' ? err : (err.message || defaultError);
				this.set('error', error);
				this.emitChange('error');
			}
		}
	}

	async deleteItem (item) {
		try {
			await item.delete();
			this.loadItems();
		} catch (error) {
			this.set('error', 'Unable to delete code.');
			this.emitChange('error');
		}
	}

	async loadItems () {
		this.set('loading', true);
		this.set('error', null);

		this.emitChange('loading');

		try {
			const items = await this.course.getAccessTokens();
			this.set('loading', false);
			this.set('items', items || []);
			this.emitChange('loading', 'items');
		} catch (error) {
			this.set('error', error);
			this.set('loading', false);
			this.emitChange('error', 'loading');
		}
	}

}
