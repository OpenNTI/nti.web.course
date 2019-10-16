import React from 'react';
import { mount } from 'enzyme';
import { DateTime } from '@nti/web-commons';

import Edit from '../Edit';

/* eslint-env jest */
describe('End date edit test', () => {
	test('Test endDate editor', () => {
		const date = new Date('2015-08-17T05:00:00Z');

		const catalogEntry = {
			'EndDate': date,
			getEndDate: function () {
				return date;
			},
			getStartDate: function () {
				return null;
			}
		};

		const cmp = mount(<Edit catalogEntry={catalogEntry}/>);

		const dateEl = cmp.find('.date').first();

		expect(dateEl.text()).toMatch('August 17, 2015');

		const dateInfoEl = dateEl.find('.date-info').first();

		expect(dateInfoEl.text()).toEqual('Monday at 05:00 am GMT');
	});

	test('Test no date', () => {
		const catalogEntry = {
			getEndDate: function () {
				return null;
			},
			getStartDate: function () {
				return null;
			}
		};

		const cmp = mount(<Edit catalogEntry={catalogEntry}/>);

		const dateEl = cmp.find('.date').first();

		const now = new Date();
		const expectedDateStr = DateTime.format(now) + DateTime.format(now, 'dddd [at] 11:59 [pm] z');

		expect(dateEl.text()).toMatch(expectedDateStr);
	});
});
