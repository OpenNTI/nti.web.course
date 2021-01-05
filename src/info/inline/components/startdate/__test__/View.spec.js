import React from 'react';
import { render } from '@testing-library/react';

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

		const x = render(<View catalogEntry={catalogEntry}/>);

		expect(x.container.querySelector('.content-column').textContent).toEqual('August 17, 2015Monday at 07:00 PM UTC');
	});
});
