import {Stores} from '@nti/lib-store';

export default class ContentViewerStore extends Stores.SimpleStore {
	setSidebar (cmp, props) {
		this.set({
			sidebarCmp: cmp,
			sidebarProps: props
		});
	}
}
