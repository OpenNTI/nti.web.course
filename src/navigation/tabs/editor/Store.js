import { Stores } from '@nti/lib-store';
import { wait } from '@nti/lib-commons';

import {
	getDefaultTabLabel,
	TABS,
	DEFAULT_ORDER,
	triggerUpdate,
} from '../Constants';

import { isValidTab } from './utils';

const MIN_SAVING_TIME = 300;

function formatTabs(course, overrides = {}) {
	const order = DEFAULT_ORDER; //TODO: get the order from the overrides
	const labels = overrides.names || {};

	const getLabel = key => (key && labels[key] != null ? labels[key] : null);
	const getDefaultLabel = key => key && getDefaultTabLabel(key);

	return order
		.filter(
			key =>
				TABS[key] &&
				!TABS[key].notEditable &&
				TABS[key].hasAccess(course)
		)
		.map(key => {
			const tab = TABS[key];
			const label = getLabel(key) || getLabel(tab.labelKey);
			const defaultLabel =
				getDefaultLabel(tab.labelKey) || getDefaultLabel(key);

			return {
				id: key,
				label: label != null ? label : defaultLabel,
				default: defaultLabel,
			};
		});
}

export default class TabNameStore extends Stores.BoundStore {
	constructor() {
		super();

		this.set({
			loading: false,
			error: null,
			canEdit: false,
			initial: null,
			tabs: null,
		});
	}

	get hasChanged() {
		const tabs = this.get('tabs');
		const initialTabs = this.get('initial');

		if ((!tabs && !initialTabs) || tabs === initialTabs) {
			return false;
		}
		if (tabs.length !== initialTabs.length) {
			return true;
		}

		for (let i = 0; i < tabs.length; i++) {
			const tab = tabs[i];
			const initial = initialTabs[i];

			if (tab.id !== initial.id || tab.label !== initial.label) {
				return true;
			}
		}

		return false;
	}

	get valid() {
		const tabs = this.get('tabs');

		if (!tabs) {
			return true;
		}

		for (let tab of tabs) {
			if (!isValidTab(tab)) {
				return false;
			}
		}

		return true;
	}

	async load() {
		if (!this.binding) {
			return;
		}

		this.set({
			loading: true,
			error: null,
			canEdit: false,
			initial: null,
			tabs: null,
		});

		try {
			const course = this.binding;
			const overrides = await course.fetchLink('GetCourseTabPreferences');
			const tabs = formatTabs(course, overrides);

			this.set({
				loading: false,
				error: null,
				canEdit: this.binding.hasLink('UpdateCourseTabPreferences'),
				initial: tabs,
				tabs,
			});
		} catch (e) {
			this.set({
				loading: false,
				error: e,
			});
		}
	}

	updateTabLabel(id, label) {
		const tabs = this.get('tabs');
		const newTabs = tabs.map(tab => {
			if (tab.id !== id) {
				return tab;
			}

			return { ...tab, label };
		});

		this.setImmediate({
			savingError: null,
			tabs: newTabs,
		});
	}

	cancelChanges() {
		this.set('tabs', this.get('initial'));
	}

	async saveChanges() {
		if (!this.binding || !this.valid) {
			return;
		}

		const course = this.binding;
		const tabs = this.get('tabs');

		this.set({
			saving: true,
			savingError: null,
		});

		try {
			const started = new Date();
			const data = tabs.reduce(
				(acc, tab) => {
					if (tab.label !== tab.default) {
						acc.names[tab.id] = tab.label;
					}
					return acc;
				},
				{ names: {}, order: [] }
			);

			const overrides = await course.putToLink(
				'UpdateCourseTabPreferences',
				data
			);
			const newTabs = formatTabs(course, overrides);
			const duration = new Date() - started;

			triggerUpdate(course);

			await wait(Math.max(0, MIN_SAVING_TIME - duration));

			this.set({
				saving: false,
				savingError: null,
				initial: newTabs,
				tabs: newTabs,
			});
		} catch (e) {
			this.set({
				saving: false,
				savingError: e,
			});
		}
	}
}
