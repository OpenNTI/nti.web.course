/* eslint-env jest */
import {stripEmptyProperties as strip} from '../';

describe('strip empty properties', () => {
	test('strips null', () => {
		const o = {test: null};
		expect(o).toHaveProperty('test');
		const stripped = strip(o);
		expect(stripped).not.toHaveProperty('test');
	});

	test('strips undefined', () => {
		const o = {test: undefined};
		expect(o).toHaveProperty('test');
		const stripped = strip(o);
		expect(stripped).not.toHaveProperty('test');
	});

	test('strips empty strings by default', () => {
		const o = {test: ''};
		expect(o).toHaveProperty('test');
		const stripped = strip(o);
		expect(stripped).not.toHaveProperty('test');
	});

	test('preserves empty strings when requested', () => {
		const o = {test: ''};
		expect(o).toHaveProperty('test');
		const stripped = strip(o, true);
		expect(stripped).toHaveProperty('test');
	});

	test('preserves false', () => {
		const o = {test: false};
		expect(o).toHaveProperty('test');
		const stripped = strip(o);
		expect(stripped).toHaveProperty('test');
	});

	test('preserves zero', () => {
		const o = {test: 0};
		expect(o).toHaveProperty('test');
		const stripped = strip(o);
		expect(stripped).toHaveProperty('test');
	});


	test('handles null input', () => {
		expect(() => strip()).not.toThrow();
	});
});
