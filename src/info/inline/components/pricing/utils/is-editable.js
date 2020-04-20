import getPurchasable from './get-purchasable';

export default function isEditable (course) {
	if (course.hasLink('CreateCoursePurchasable')) { return true; }

	const purchasable = getPurchasable(course);

	return purchasable?.hasLink?.('edit');
}