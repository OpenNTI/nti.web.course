export const Success = 'success';
export const Failed = 'failed';
export const Incomplete = 'incompleted';

export function getCompletedStatus(item, completedItems) {
	if (!item) {
		return Incomplete;
	}
	const override =
		completedItems?.[item.NTIID] ||
		completedItems?.[item.href] ||
		completedItems?.[item['Target-NTIID']] ||
		completedItems?.[item['target-NTIID']];

	if (!override) {
		return item.getCompletedDate?.()
			? item.completedSuccessfully()
				? Success
				: Failed
			: Incomplete;
	}

	return override ? (override.Success ? Success : Failed) : Incomplete;
}

export function getCompletedDate(item, completedItems) {
	if (!item) {
		return null;
	}

	const override =
		completedItems?.[item.NTIID] ||
		completedItems?.[item.href] ||
		completedItems?.[item['Target-NTIID']] ||
		completedItems?.[item['target-NTIID']];

	return override ? override.getCompletedDate?.() : item.getCompletedDate?.();
}
