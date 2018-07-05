export default function hasStarted (catalogEntry) {
	const startDate = catalogEntry.getStartDate();

	return !startDate || startDate < Date.now();
}
