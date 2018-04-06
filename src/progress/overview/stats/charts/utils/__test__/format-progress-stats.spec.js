/* eslint-env jest */
import formatProgressStats from '../format-progress-stats';

const testData = {
	TotalUsers: 100,
	ProgressDistribution: {
		'0.0': 5,
		'0.05': 5,
		'0.1': 5,
		'0.15': 5,
		'0.2': 5,
		'0.25': 5,
		'0.3': 5,
		'0.35': 5,
		'0.4': 5,
		'0.45': 5,
		'0.5': 5,
		'0.55': 5,
		'0.6': 5,
		'0.65': 5,
		'0.7': 5,
		'0.75': 5,
		'0.8': 5,
		'0.85': 5,
		'0.9': 5,
		'0.95': 5,
		'1.0': 5
	}
};

describe('formatProgressStats test', () => {
	function testExpected (stats, expected) {
		expect(stats.upperBound).toEqual(100);
		expect(stats.series.length).toEqual(expected.length);

		for (let i = 0; i < expected.length; i++) {
			const exp = expected[i];
			const stat = stats.series[i];

			expect(stat.start).toEqual(exp.start);
			expect(stat.end).toEqual(exp.end);
			expect(stat.total).toEqual(exp.total);
		}
	}

	test('Large Distribution', () => {
		const stats = formatProgressStats(testData, true);
		const expected = [
			{start: 0, end: 0.09, total: 10},
			{start: 0.1, end: 0.19, total: 10},
			{start: 0.2, end: 0.29, total: 10},
			{start: 0.3, end: 0.39, total: 10},
			{start: 0.4, end: 0.49, total: 10},
			{start: 0.5, end: 0.59, total: 10},
			{start: 0.6, end: 0.69, total: 10},
			{start: 0.7, end: 0.79, total: 10},
			{start: 0.8, end: 0.89, total: 10},
			{start: 0.9, end: 1.0, total: 15}
		];

		testExpected(stats, expected);
	});

	test('Small Distribution', () => {
		const stats = formatProgressStats(testData);
		const expected = [
			{start: 0, end: 0.19, total: 20},
			{start: 0.2, end: 0.39, total: 20},
			{start: 0.4, end: 0.59, total: 20},
			{start: 0.6, end: 0.79, total: 20},
			{start: 0.8, end: 1.0, total: 25}
		];

		testExpected(stats, expected);
	});
});
