export default function getPurchasable (course) {
	return course?.getEnrollmentOptions()?.getEnrollmentOptionForPurchase()?.getPurchasable();
}