import { render } from '@testing-library/react';

import DatePicker from '../DatePicker';

/* eslint-env jest */
describe('DatePicker test', () => {
	const date = new Date(2017, 2, 3);

	test('Test empty text', () => {
		const x = render(<DatePicker />);

		const dateEl = x.container.querySelector('.date');

		expect(dateEl.textContent).toEqual('Set a Date');
		expect(dateEl.getAttribute('class')).toMatch(/no-date/);
	});

	test('Test date text', () => {
		const x = render(<DatePicker date={date} />);

		const dateEl = x.container.querySelector('.date');

		expect(dateEl.textContent).toMatch(/March 3, 2017/);
		expect(dateEl.getAttribute('class')).not.toMatch(/no-date/);

		const dateInfoEl = dateEl.querySelector('.date-info');

		expect(dateInfoEl.textContent).toEqual('Friday at 12:00 AM UTC');
	});
});
