import React from 'react';
import { mount } from 'enzyme';

import View from '../View';

/* eslint-env jest */
describe('Start date view test', () => {
	test('Test start date text', () => {
		const date = '2015-08-17T19:00:00Z';

		const catalogEntry = {
			'StartDate': date,
			getStartDate: function () {
				return date;
			},
			getEndDate: function () {
				return null;
			}
		};

		const cmp = mount(<View catalogEntry={catalogEntry}/>);

		expect(cmp.find('.content-column').text()).toEqual('August 17, 2015Monday at 07:00 pm GMT');
	});
});
