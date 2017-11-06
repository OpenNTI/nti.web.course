import React from 'react';
import { mount } from 'enzyme';

import View from '../View';

/* eslint-env jest */
describe('Department view test', () => {
	test('Test department name', () => {
		const identifier = 'ABC123';

		const catalogEntry = {
			'ProviderUniqueID': identifier
		};

		const cmp = mount(<View catalogEntry={catalogEntry}/>);

		expect(cmp.find('.course-view-identifier').text()).toEqual(identifier);
	});
});
