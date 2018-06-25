import {DateTime} from '@nti/web-commons';

const FORMAT = 'MMMM Do, h:mm A z';

export default function formatStartDate (catalogEntry) {
	const startDate = catalogEntry.getStartDate();

	return startDate ? DateTime.format(startDate, FORMAT) : null;
}
