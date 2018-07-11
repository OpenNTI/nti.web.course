import {DateTime} from '@nti/web-commons';

const FULL_FORMAT = 'MMMM Do, h:mm A z';
const M_D_Y_FORMAT = 'MMMM Do, YYYY';

export default function getCatalogEntryData (catalogEntry, option) {
	const startDate = catalogEntry.getStartDate();
	const endDate = catalogEntry.getEndDate();
	const enrollCutOffDate = option.getEnrollCutOffDate && option.getEnrollCutOffDate();

	return {
		fullStartDate: startDate && DateTime.format(startDate, FULL_FORMAT),
		fullEndDate: endDate && DateTime.format(endDate, FULL_FORMAT),
		title: catalogEntry.title,
		price: option.getPrice && option.getPrice(),
		enrollCutOffDate: enrollCutOffDate && DateTime.format(enrollCutOffDate, M_D_Y_FORMAT)
	};
}
