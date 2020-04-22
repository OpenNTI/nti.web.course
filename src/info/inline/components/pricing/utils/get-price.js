import getPurchasable from './get-purchasable';

export default function getPrice (course) {
	const purchasable = getPurchasable(course);
	const enrollmentOption = course?.getEnrollmentOptions()?.getEnrollmentOptionForPurchase();

	return purchasable && enrollmentOption?.enabled ? {amount: (purchasable.amount ?? 0) * 100, currency: purchasable.currency} : null;
}