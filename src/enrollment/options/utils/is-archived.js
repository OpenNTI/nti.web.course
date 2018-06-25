export default function isArchived (catalogEntry) {
	const endDate = catalogEntry.getEndDate();

	return endDate && endDate < Date.now();
}
