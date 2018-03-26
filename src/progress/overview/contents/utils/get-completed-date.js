export default function getCompletedDate (item, completedItems) {
	const {Items} = completedItems || {};

	return Items && (Items[item.NTIID] || Items[item.href] || Items[item['Target-NTIID']] || Items[item['target-NTIID']]);
}
