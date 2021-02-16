/* eslint-env jest */
import isValidTab from '../is-valid-tab';

import { VALID_TABS, INVALID_TABS } from './Constants';

describe('getTabError', () => {
	test('returns true if the tab is valid', () => {
		for (let tab of VALID_TABS) {
			expect(isValidTab(tab)).toBeTruthy();
		}
	});

	test('returns false if the tab is invalid', () => {
		for (let tab of INVALID_TABS) {
			expect(isValidTab(tab)).toBeFalsy();
		}
	});
});
