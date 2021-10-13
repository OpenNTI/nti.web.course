import { render } from '@testing-library/react';

import View from '../View';

/* eslint-env jest */
describe('Meeting times view test', () => {
	test('Test meeting times items', () => {
		const Schedule = {
			days: ['M', 'W', 'F'],
			times: ['10:30:00-05:00', '12:20:00-05:00'],
		};

		const catalogEntry = {
			Schedule,
		};

		const x = render(<View catalogEntry={catalogEntry} />);

		const dayRows = x.container.querySelectorAll('.day-row');

		expect(dayRows[0].textContent).toEqual('monday10:30 AM-12:20 PM');
		expect(dayRows[1].textContent).toEqual('wednesday10:30 AM-12:20 PM');
		expect(dayRows[2].textContent).toEqual('friday10:30 AM-12:20 PM');

		expect(dayRows.length).toBe(3);
	});
});
