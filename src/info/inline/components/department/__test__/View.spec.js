import React from 'react';
import { mount } from 'enzyme';

import View from '../View';

/* eslint-env jest */
describe('Department view test', () => {
	test('Test department name', () => {
		const depName = 'ABC123';

		const catalogEntry = {
			'ProviderDepartmentTitle': depName
		};

		const cmp = mount(<View catalogEntry={catalogEntry}/>);

		expect(cmp.find('.content-column').text()).toEqual(depName);
	});
});
