import React from 'react';
import { render } from '@testing-library/react';
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

		const x = render(<Edit catalogEntry={catalogEntry}/>);

		const dateEl = x.container.querySelector('.date');

		expect(dateEl.textContent).toMatch('August 17, 2015');

		const dateInfoEl = dateEl.querySelector('.date-info');

		expect(dateInfoEl.textContent).toEqual('Monday at 05:00 am UTC');
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

		const x = render(<Edit catalogEntry={catalogEntry}/>);

		const dateEl = x.container.querySelector('.date');

		const now = new Date();
		const expectedDateStr = DateTime.format(now) + DateTime.format(now, 'dddd [at] 12:00 [am] z');

		expect(dateEl.textContent).toMatch(expectedDateStr);
	});
});
