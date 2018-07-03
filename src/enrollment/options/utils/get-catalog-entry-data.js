import {DateTime} from '@nti/web-commons';

const FULL_FORMAT = 'MMMM Do, h:mm A z';

export default function getCatalogEntryData (catalogEntry) {
	const startDate = catalogEntry.getStartDate();
	const endDate = catalogEntry.getEndDate();

	return {
		fullStartDate: startDate && DateTime.format(startDate, FULL_FORMAT),
		fullEndDate: endDate && DateTime.format(endDate, FULL_FORMAT),
		title: catalogEntry.title
	};
}
