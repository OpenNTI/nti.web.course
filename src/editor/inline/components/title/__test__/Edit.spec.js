import React from 'react';
import { mount } from 'enzyme';

import Edit from '../Edit';

/* eslint-env jest */
describe('Title edit test', () => {
	const onChange = jest.fn();

	test('Test title editor', () => {
		const title = 'A Title';

		const catalogEntry = {
			'title': title
		};

		const cmp = mount(<Edit onValueChange={onChange} catalogEntry={catalogEntry}/>);

		const input = cmp.find('.title-input').first();

		expect(input.props().value).toEqual(title);

		input.simulate('change');

		expect(onChange).toHaveBeenCalledWith('title', title);
	});
});
