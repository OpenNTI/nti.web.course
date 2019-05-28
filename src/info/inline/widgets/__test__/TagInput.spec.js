import React from 'react';
import { mount } from 'enzyme';

import TagInput from '../TagInput';

/* eslint-env jest */
describe('TagInput test', () => {
	test('Test existing value', () => {
		const values = ['abc', '123', 'def'];
		const cmp = mount(<TagInput value={values}/>);

		// there should be three tokens for the existing values
		const tokens = cmp.find('div.token');

		expect(tokens.length).toEqual(3);

		for(let i = 0; i < values.length; i++) {
			expect(tokens.at(i).text()).toEqual(values[i]);
		}

		// there should be an input representing the next token as the user types
		const inputs = cmp.find('input');

		expect(inputs.length).toEqual(1);
	});
});
