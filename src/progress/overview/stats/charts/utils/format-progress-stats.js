const LARGE_GROUPS = [
	{start: 0, end: 0.1, keys: ['0.0', '0.05']},
	{start: 0.1, end: 0.2, keys: ['0.1', '0.15']},
	{start: 0.2, end: 0.3, keys: ['0.2', '0.25']},
	{start: 0.3, end: 0.4, keys: ['0.3', '0.35']},
	{start: 0.4, end: 0.5, keys: ['0.4', '0.45']},
	{start: 0.5, end: 0.6, keys: ['0.5', '0.55']},
	{start: 0.6, end: 0.7, keys: ['0.6', '0.65']},
	{start: 0.7, end: 0.8, keys: ['0.7', '0.75']},
	{start: 0.8, end: 0.9, keys: ['0.8', '0.85']},
	{start: 0.9, end: 1.0, keys: ['0.9', '0.95', '1.0']}
];

const SMALL_GROUPS = [
	{start: 0, end: 0.2, keys: ['0.0', '0.05', '0.1', '0.15']},
	{start: 0.2, end: 0.4, keys: ['0.2', '0.25', '0.3', '0.35']},
	{start: 0.4, end: 0.6, keys: ['0.4', '0.45', '0.5', '0.55']},
	{start: 0.6, end: 0.8, keys: ['0.6', '0.65', '0.7', '0.75']},
	{start: 0.8, end: 1.0, keys: ['0.8', '0.85', '0.9', '0.95', '1.0']}
];

function getSeries (distribution, groups) {
	return groups
		.map(group => {
			return {
				start: group.start,
				end: group.end,
				total: group.keys.reduce((acc, key) => {
					return acc + distribution[key];
				}, 0)
			};
		});
}


function getSeriesLarge (distribution) {
	return getSeries(distribution, LARGE_GROUPS);
}

function getSeriesSmall (distribution) {
	return getSeries(distribution, SMALL_GROUPS);
}

export default function formatProgressStats (stats , large, enrollment) {
	const {ProgressDistribution, TotalUsers} = stats;
	const series = large ? getSeriesLarge(ProgressDistribution) : getSeriesSmall(ProgressDistribution);

	return {
		series,
		upperBound: TotalUsers
	};
}
