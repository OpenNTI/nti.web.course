import {Stores} from '@nti/lib-store';

import {
	getDefaultTabLabel,
	TABS,
	DEFAULT_ORDER,
	addUpdateListener,
	removeUpdateListener
} from './Constants';


function shouldShowTab (key, course) {
	if (!TABS[key] || !TABS[key].hasAccess(course)) { return false; }
	if (TABS[key].doNotShowInPreview && course.CatalogEntry.Preview) { return false; }

	return true;
}

function formatTabs (course, overrides = {}) {
	const order = DEFAULT_ORDER;//TODO: get the order from the overrides if it gets defined
	const labels = overrides.names || {};

	return order
		.filter(key => shouldShowTab(key, course))
		.map((key) => {
			const tab = TABS[key];

			return {
				id: key,
				label: labels[key] != null ? labels[key] : getDefaultTabLabel(key),
				isRootRoute: tab && tab.isRootRoute,
				subRoutes: tab && tab.subRoutes
			};
		});
}

export default class CourseTabStore extends Stores.BoundStore {
	constructor () {
		super();

		addUpdateListener(this.onTabUpdate);
	}


	cleanup () {
		removeUpdateListener(this.onTabUpdate);
	}

	async load () {
		if (!this.binding) { return; }

		const course = this.binding;

		try {
			const overrides = await course.fetchLink('GetCourseTabPreferences');

			this.set({
				tabs: formatTabs(course, overrides)
			});
		} catch (e) {
			this.set({
				tabs: formatTabs(course)
			});
		}
	}


	onTabUpdate = () => {
		this.load();
	}
}
