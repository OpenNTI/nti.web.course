import React from 'react';
import { mount } from 'enzyme';

import View from '../View';

/* eslint-env jest */
describe('Description view test', () => {
	test('Test description text', () => {
		const desc = 'DESC123';

		const catalogEntry = {
			'description': desc
		};

		const cmp = mount(<View catalogEntry={catalogEntry}/>);

		expect(cmp.find('.course-view-description').text()).toEqual(desc);
	});
});
