export default function hasOpenAndPurchaseEnrollment (course) {
	const enrollmentOptions = course?.getEnrollmentOptions();

	const open = enrollmentOptions?.getEnrollmentOptionForOpen();
	const purchase = enrollmentOptions?.getEnrollmentOptionForPurchase();

	return open?.enabled && purchase?.enabled;
}