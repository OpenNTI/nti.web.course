import { render } from '@testing-library/react';

import View from '../View';

/* eslint-env jest */
describe('End date view test', () => {
	test('Test end date text', () => {
		const date = new Date('2015-08-17T08:15:00Z');

		const catalogEntry = {
			EndDate: date,
			getEndDate: function () {
				return date;
			},
			getStartDate: function () {
				return null;
			},
		};

		const x = render(<View catalogEntry={catalogEntry} />);

		expect(
			x.container.querySelector('.content-column').textContent
		).toEqual('August 17, 2015Monday at 08:15 AM UTC');
	});
});
