import {NEXT, PREVIOUS} from '../Constants';

import getItemName from './get-item-name';

export default function resolveKey (items, active, key) {
	if (key !== NEXT && key !== PREVIOUS) { return key; }

	for (let i = 0; i < items.length; i++) {
		let name = getItemName(items[i]);

		if (name === active) {
			if (key === NEXT) {
				return getItemName(items[i + 1]);
			}

			if (key === PREVIOUS) {
				return getItemName(items[i - 1]);
			}
		}
	}
}
