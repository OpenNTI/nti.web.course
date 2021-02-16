import { getWeekdaysFrom, getDateStr, convertToTimeStr } from '../';

/* eslint-env jest */
describe('Test meet time utility: getWeekdaysFrom', () => {
	test('Test some days', () => {
		const catalogEntry = {
			Schedule: {
				days: ['M', 'W', 'F'],
			},
		};

		const weekdays = getWeekdaysFrom(catalogEntry);

		expect(weekdays).toEqual(['monday', 'wednesday', 'friday']);
	});

	test('Test all days', () => {
		const catalogEntry = {
			Schedule: {
				days: ['N', 'M', 'T', 'W', 'R', 'F', 'S'],
			},
		};

		const weekdays = getWeekdaysFrom(catalogEntry);

		expect(weekdays).toEqual([
			'sunday',
			'monday',
			'tuesday',
			'wednesday',
			'thursday',
			'friday',
			'saturday',
		]);
	});

	test('Test no days', () => {
		const catalogEntry = {
			Schedule: {
				days: [],
			},
		};

		const weekdays = getWeekdaysFrom(catalogEntry);

		expect(weekdays).toEqual([]);
	});

	test('Test empty string', () => {
		const catalogEntry = {
			Schedule: {
				days: [''],
			},
		};

		const weekdays = getWeekdaysFrom(catalogEntry);

		expect(weekdays).toEqual([]);
	});

	test('Test no Schedule', () => {
		const catalogEntry = {};

		const weekdays = getWeekdaysFrom(catalogEntry);

		expect(weekdays).toEqual([]);
	});

	test('Test no days', () => {
		const catalogEntry = {
			Schedule: {},
		};

		const weekdays = getWeekdaysFrom(catalogEntry);

		expect(weekdays).toEqual([]);
	});

	test('Test legacy format', () => {
		const catalogEntry = {
			Schedule: {
				days: ['MWF'],
			},
		};

		const weekdays = getWeekdaysFrom(catalogEntry);

		expect(weekdays).toEqual(['monday', 'wednesday', 'friday']);
	});
});

describe('Test meet time utility: getDateStr', () => {
	test('Test basic date', () => {
		const result = getDateStr('13:45');

		expect(result.getHours()).toEqual(13);
		expect(result.getMinutes()).toEqual(45);
	});

	test('Test no date', () => {
		const result = getDateStr();

		// defaults to 9:00 AM
		expect(result.getHours()).toEqual(9);
		expect(result.getMinutes()).toEqual(0);
	});
});

describe('Test meet time utility: convertToTimeStr', () => {
	test('Test basic time', () => {
		const time = '15:35';

		const result = convertToTimeStr(time);

		expect(result).toEqual('3:35 PM');
	});

	test('Test no time', () => {
		const result = convertToTimeStr();

		expect(result).toEqual('');
	});
});
