import React from 'react';
import { mount } from 'enzyme';

import Edit from '../Edit';

/* eslint-env jest */
describe('Tags edit test', () => {
	test('Test tags editor', () => {
		const tags = ['ab', 'cd', '12'];

		const catalogEntry = {
			tags
		};

		const cmp = mount(<Edit catalogEntry={catalogEntry}/>);

		const tokens = cmp.find('div.token');

		expect(tokens.length).toEqual(3);

		for(let i = 0; i < tags.length; i++) {
			expect(tokens.at(i).text()).toEqual(tags[i].toUpperCase());
		}

		// there should be an input representing the next token as the user types
		const inputs = cmp.find('input');

		expect(inputs.length).toEqual(1);
	});
});
