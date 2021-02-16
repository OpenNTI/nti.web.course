import getCatalogEntryData from './get-catalog-entry-data';
import isArchived from './is-archived';
import hasStarted from './has-started';

const ATTRIBUTES = [
	c => (isArchived(c) ? 'archived' : 'notArchived'),
	c => (c.getEndDate() ? 'endDate' : 'noEndDate'),
	(c, o) => (o && o.isEnrolled ? 'enrolled' : 'notEnrolled'),
	c => (c.getStartDate() ? 'startDate' : 'noStartDate'),
	c => (hasStarted(c) ? 'started' : 'notStarted'),
	(c, o) => (o && o.getPrice && o.getPrice() ? 'hasPrice' : 'noPrice'),
	(c, o) =>
		o && o.getEnrollCutOffDate && o.getEnrollCutOffDate()
			? 'hasCutOff'
			: 'noCutOff',
	(c, o, a) => {
		const endDate = c.getEndDate();
		const enrolledDate = a && a.getCreatedTime();

		if (!enrolledDate) {
			return null;
		}

		return !endDate || enrolledDate < endDate
			? 'enrolledBeforeArchived'
			: 'enrolledAfterArchived';
	},
];

//https://codereview.stackexchange.com/questions/7001/generating-all-combinations-of-an-array
function combinations(items) {
	const result = [];

	function combine(prefix, rest) {
		for (let i = 0; i < rest.length; i++) {
			result.push([...prefix, rest[i]]);
			combine([...prefix, rest[i]], rest.slice(i + 1));
		}
	}

	combine([], items);
	return result;
}

export default function getTranslationFor(
	t,
	base,
	catalogEntry,
	option,
	access
) {
	const attributes = ATTRIBUTES.map(getKey =>
		getKey(catalogEntry, option, access)
	).filter(key => key);
	const keyCombos = combinations(attributes).sort(
		(a, b) => b.length - a.length
	);

	for (let keyCombo of keyCombos) {
		const key = `${base}.${keyCombo.join('-')}`;

		if (!t.isMissing(key)) {
			return t(key, getCatalogEntryData(catalogEntry, option));
		}
	}

	return t(base, getCatalogEntryData(catalogEntry, option));
}
