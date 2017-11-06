import React from 'react';
import { mount } from 'enzyme';

import Edit from '../Edit';

/* eslint-env jest */
describe('Redemption codes edit test', () => {
	// Currently, there is no department editor
	test('Test that it does nothing!', () => {
		const redemptionCodes = [
			{
				Code: 'RC1'
			},
			{
				Code: 'RC2'
			}
		];

		const cmp = mount(<Edit redemptionCodes={redemptionCodes}/>);

		expect(cmp.html()).toEqual('<div></div>');
	});
});
