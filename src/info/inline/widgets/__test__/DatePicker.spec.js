import React from 'react';
import { mount } from 'enzyme';

import DatePicker from '../DatePicker';

/* eslint-env jest */
describe('DatePicker test', () => {
	const date = new Date(2017,2,3);

	test('Test empty text', () => {
		const cmp = mount(<DatePicker/>);

		const dateEl = cmp.find('.date').first();

		expect(dateEl.text()).toEqual('Set a Date');
		expect(dateEl.prop('className')).toMatch(/no-date/);
	});

	test('Test date text', () => {
		const cmp = mount(<DatePicker date={date}/>);

		const dateEl = cmp.find('.date').first();

		expect(dateEl.text()).toMatch(/March 3, 2017/);
		expect(dateEl.prop('className')).not.toMatch(/no-date/);

		const dateInfoEl = dateEl.find('.date-info').first();

		expect(dateInfoEl.text()).toEqual('Friday at 12:00 am UTC');
	});
});
