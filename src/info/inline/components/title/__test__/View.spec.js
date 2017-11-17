import React from 'react';
import { mount } from 'enzyme';

import View from '../View';

/* eslint-env jest */
describe('Title view test', () => {
	test('Test title text', () => {
		const title = 'A Title';

		const catalogEntry = {
			'title': title
		};

		const cmp = mount(<View catalogEntry={catalogEntry}/>);

		expect(cmp.find('.course-view-title').text()).toEqual(title);
	});
});
