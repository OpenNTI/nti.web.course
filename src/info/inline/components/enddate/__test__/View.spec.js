import React from 'react';
import { mount } from 'enzyme';

import View from '../View';

/* eslint-env jest */
describe('End date view test', () => {
	test('Test end date text', () => {
		const date = '2015-08-17T08:15:00Z';

		const catalogEntry = {
			'EndDate': date
		};

		const cmp = mount(<View catalogEntry={catalogEntry}/>);

		expect(cmp.find('.content-column').text()).toEqual('August 17, 2015Monday at 03:15 am CDT');
	});
});
