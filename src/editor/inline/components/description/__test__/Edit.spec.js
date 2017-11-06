import React from 'react';
import { mount } from 'enzyme';

import Edit from '../Edit';

/* eslint-env jest */
describe('Description edit test', () => {
	const onChange = jest.fn();

	test('Test description editor', () => {
		const desc = 'DESC123';

		const catalogEntry = {
			'description': desc
		};

		const cmp = mount(<Edit onValueChange={onChange} catalogEntry={catalogEntry}/>);

		const input = cmp.find('.description-input').first();

		expect(input.props().value).toEqual(desc);

		input.simulate('change');

		expect(onChange).toHaveBeenCalledWith('description', desc);
	});
});
