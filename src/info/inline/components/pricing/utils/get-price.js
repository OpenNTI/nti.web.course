import getPurchasable from './get-purchasable';

export default function getPrice (course) {
	const purchasable = getPurchasable(course);

	return purchasable ? {amount: purchasable.amount, currency: purchasable.currency} : null;
}