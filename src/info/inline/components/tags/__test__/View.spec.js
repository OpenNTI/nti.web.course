import React from 'react';
import { mount } from 'enzyme';

import View from '../View';

/* eslint-env jest */
describe('Tags view test', () => {
	test('Test tags text', () => {
		const tags = ['ab', 'cd', '12'];

		const catalogEntry = {
			tags
		};

		const cmp = mount(<View catalogEntry={catalogEntry}/>);

		const tagCmps = cmp.find('.tag');

		expect(tagCmps.length).toBe(3);

		for(let i = 0; i < tags.length; i++) {
			expect(tagCmps.at(i).text()).toEqual(tags[i]);
		}
	});
});
