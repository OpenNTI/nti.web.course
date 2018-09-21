/* eslint-env jest */
import getTabError from '../get-tab-error';

import {VALID_TABS, INVALID_TABS} from './Constants';

describe('getTabError', () => {
	test('returns null if the tab is valid', () => {
		for (let tab of VALID_TABS) {
			expect(getTabError(tab)).toEqual(null);
		}
	});

	test('returns error if label is longer than 20 characters', () => {
		for (let tab of INVALID_TABS) {
			if (tab.id === 'tooLong') {
				expect(getTabError(tab)).toEqual('Must be less than 20 characters');
			} else if (tab.id === 'blank') {
				expect(getTabError(tab)).toEqual('Cannot be blank')
			}
		}
	});
});
