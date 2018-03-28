function fillInItems (items, enrollment) {
	if (!items) { return; }

	for (let item of items) {
		const subItems = item.Items;

		if (item.updateCompletedState) {
			item.updateCompletedState(enrollment);
		}

		if (subItems) { fillInItems(subItems, enrollment); }
	}
}

export default function fillInCompletedState (overview, enrollment) {
	fillInItems(overview.Items, enrollment);
}
