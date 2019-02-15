/* eslint-env jest */
import {stripEmptyProperties as strip} from '../';

describe('strip empty properties', () => {
	test('strips null', () => {
		const o = {test: null};
		expect(o.hasOwnProperty('test')).toBeTruthy();
		const stripped = strip(o);
		expect(stripped.hasOwnProperty('test')).toBeFalsy();
	});

	test('strips undefined', () => {
		const o = {test: undefined};
		expect(o.hasOwnProperty('test')).toBeTruthy();
		const stripped = strip(o);
		expect(stripped.hasOwnProperty('test')).toBeFalsy();
	});

	test('strips empty strings by default', () => {
		const o = {test: ''};
		expect(o.hasOwnProperty('test')).toBeTruthy();
		const stripped = strip(o);
		expect(stripped.hasOwnProperty('test')).toBeFalsy();
	});
	
	test('preserves empty strings when requested', () => {
		const o = {test: ''};
		expect(o.hasOwnProperty('test')).toBeTruthy();
		const stripped = strip(o, true);
		expect(stripped.hasOwnProperty('test')).toBeTruthy();
	});

	test('preserves false', () => {
		const o = {test: false};
		expect(o.hasOwnProperty('test')).toBeTruthy();
		const stripped = strip(o);
		expect(stripped.hasOwnProperty('test')).toBeTruthy();
	});

	test('preserves zero', () => {
		const o = {test: 0};
		expect(o.hasOwnProperty('test')).toBeTruthy();
		const stripped = strip(o);
		expect(stripped.hasOwnProperty('test')).toBeTruthy();
	});


	test('handles null input', () => {
		expect(() => strip()).not.toThrow();
	});
});
