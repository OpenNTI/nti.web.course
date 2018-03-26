import getCompletedDate from './get-completed-date';

function filterItems (items, completedItems) {
	return items.reduce((acc, item) => {
		const {Items:subItems} = item;
		const filteredItems = subItems && filterItems(subItems, completedItems);
		const completedDate = getCompletedDate(item, completedItems);

		if (completedDate !== undefined || (filteredItems && filteredItems.length)) {
			item.Items = filteredItems;
			item.CompletedDate = completedDate;

			acc.push(item);
		}

		return acc;
	}, []);
}

export default function filterOutNonRequiredItems (overview, completedItems) {
	overview.Items = overview.Items ? filterItems(overview.Items, completedItems) : overview.Items;

	return overview;
}
