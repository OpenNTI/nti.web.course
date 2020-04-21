import getPurchasable from './get-purchasable';

export default function getPrice (course) {
	const purchasable = getPurchasable(course);

	return purchasable && purchasable.Public !== false ? {amount: (purchasable.amount ?? 0) * 100, currency: purchasable.currency} : null;
}