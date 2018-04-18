import React from 'react';
import { mount } from 'enzyme';
import { DateTime } from '@nti/web-commons';

import Edit from '../Edit';

/* eslint-env jest */
describe('Start date edit test', () => {
	test('Test startDate editor', () => {
		const date = new Date('2015-08-17T05:00:00Z');

		const catalogEntry = {
			'StartDate': date,
			getStartDate: function () {
				return date;
			},
			getEndDate: function () {
				return null;
			}
		};

		const cmp = mount(<Edit catalogEntry={catalogEntry}/>);

		const dateEl = cmp.find('.date').first();

		expect(dateEl.text()).toMatch('August 17, 2015');

		const dateInfoEl = dateEl.find('.date-info').first();

		expect(dateInfoEl.text()).toEqual('Monday at 12:00 am CDT');
	});

	test('Test no date', () => {
		const catalogEntry = {
			getStartDate: function () {
				return null;
			},
			getEndDate: function () {
				return null;
			}
		};

		const cmp = mount(<Edit catalogEntry={catalogEntry}/>);

		const dateEl = cmp.find('.date').first();

		const now = new Date();
		const expectedDateStr = DateTime.format(now) + DateTime.format(now, 'dddd [at] 12:00 [am] z');

		expect(dateEl.text()).toMatch(expectedDateStr);
	});
});
