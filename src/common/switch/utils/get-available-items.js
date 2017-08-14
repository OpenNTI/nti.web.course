import {NEXT, PREVIOUS} from '../Constants';

import getItemName from './get-item-name';

export default function getAvailableItems (items, active) {
	let activeItems = {};

	activeItems[PREVIOUS] = true;
	activeItems[NEXT] = true;

	for (let i = 0; i < items.length; i++) {
		let name = getItemName(items[i]);

		activeItems[name] = true;

		if (name === active) {
			activeItems[PREVIOUS] = i !== 0;
			activeItems[NEXT] = i !== items.length - 1;
		}
	}

	return activeItems;
}
