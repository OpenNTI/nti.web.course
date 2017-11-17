import React from 'react';
import { mount } from 'enzyme';

import View from '../View';

/* eslint-env jest */
describe('Start date view test', () => {
	test('Test start date text', () => {
		const date = '2015-08-17T05:00:00Z';

		const catalogEntry = {
			'StartDate': date
		};

		const cmp = mount(<View catalogEntry={catalogEntry}/>);

		expect(cmp.find('.content-column').text()).toEqual('August 17, 2015');
	});
});
