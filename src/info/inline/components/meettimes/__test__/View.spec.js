import React from 'react';
import { mount } from 'enzyme';

import View from '../View';

/* eslint-env jest */
describe('Meeting times view test', () => {
	test('Test meeting times items', () => {
		const Schedule = {
			days: ['M', 'W', 'F'],
			times: ['10:30:00-05:00', '12:20:00-05:00']
		};

		const catalogEntry = {
			Schedule
		};

		const cmp = mount(<View catalogEntry={catalogEntry}/>);

		const dayRows = cmp.find('.day-row');

		expect(dayRows.at(0).text()).toEqual('monday\'s10:30 AM-12:20 PM');
		expect(dayRows.at(1).text()).toEqual('wednesday\'s10:30 AM-12:20 PM');
		expect(dayRows.at(2).text()).toEqual('friday\'s10:30 AM-12:20 PM');

		expect(dayRows.length).toBe(3);
	});
});
