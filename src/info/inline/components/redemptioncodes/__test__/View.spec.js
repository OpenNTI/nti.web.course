import React from 'react';
import { mount } from 'enzyme';

import View from '../View';

/* eslint-env jest */
describe('Redemption codes view test', () => {
	test('Test Redemption code items', () => {
		const redemptionCodes = [
			{
				Code: 'RC1'
			},
			{
				Code: 'RC2'
			}
		];

		const cmp = mount(<View redemptionCodes={redemptionCodes}/>);


		const items = cmp.find('.redemption-code');

		for(let i = 0; i < redemptionCodes.length; i++) {
			expect(items.at(i).text()).toEqual(redemptionCodes[i].Code);
		}
	});

	test('Test no items', () => {
		const cmp = mount(<View/>);

		expect(cmp.find('.content-column').first().text()).toEqual('None');
	});
});
