import { DateTime } from '@nti/web-commons';

const FULL_FORMAT = DateTime.MONTH_NAME_ORDINAL_DAY_TIME_WITH_ZONE;
const M_D_Y_FORMAT = DateTime.MONTH_NAME_ORDINAL_DAY_YEAR;

export default function getCatalogEntryData(catalogEntry, option) {
	const startDate = catalogEntry.getStartDate();
	const endDate = catalogEntry.getEndDate();
	const enrollCutOffDate =
		option && option.getEnrollCutOffDate && option.getEnrollCutOffDate();
	const price = option && option.getPrice && option.getPrice();
	const priceDisplay =
		option && option.getPriceDisplay && option.getPriceDisplay();

	return {
		fullStartDate: startDate && DateTime.format(startDate, FULL_FORMAT),
		fullEndDate: endDate && DateTime.format(endDate, FULL_FORMAT),
		title: catalogEntry.title,
		price,
		priceDisplay,
		enrollCutOffDate:
			enrollCutOffDate && DateTime.format(enrollCutOffDate, M_D_Y_FORMAT),
	};
}
