import {validateTag} from '../index';

/* eslint-env jest */
describe('validateTag test', () => {
	test('Test no value', () => {
		const result = validateTag();

		expect(result.length).toBe(0);
	});

	test('Test period only', () => {
		const result = validateTag('.');

		expect(result[0]).toEqual('Invalid tag name');
	});

	test('Test period with trailing spaces', () => {
		const result = validateTag('.   ');

		expect(result[0]).toEqual('Invalid tag name');
	});

	test('Test period with leading spaces', () => {
		const result = validateTag('   .');

		expect(result[0]).toEqual('Invalid tag name');
	});

	test('Test single slash', () => {
		const result = validateTag('/');

		expect(result[0]).toEqual('\'/\' characters are not allowed');
	});

	test('Test slash in text', () => {
		const result = validateTag('some/tag');

		expect(result[0]).toEqual('\'/\' characters are not allowed');
	});

	test('Test valid period', () => {
		const result = validateTag('some.tag');

		expect(result.length).toBe(0);
	});

	test('Test valid period with spaces', () => {
		const result = validateTag('   some.tag    ');

		expect(result.length).toBe(0);
	});
});
