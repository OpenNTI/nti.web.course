/* eslint-env jest */
import getItemName from '../get-item-name';

describe('get-item-name', () => {
	test('gets name', () => {
		expect(getItemName({props: {name: 'name'}})).toEqual('name');
	});

	test('falsy if no props', () => {
		expect(getItemName({})).toBeFalsy();
	});

	test('falsy if no props', () => {
		expect(getItemName()).toBeFalsy();
	});
});
