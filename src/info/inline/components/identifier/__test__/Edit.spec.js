import React from 'react';
import { mount } from 'enzyme';

import Edit from '../Edit';

/* eslint-env jest */
describe('Department edit test', () => {
	const onChange = jest.fn();

	test('Test identifier edit', () => {
		const identifier = 'ABC123';

		const catalogEntry = {
			'ProviderUniqueID': identifier
		};

		const cmp = mount(<Edit onValueChange={onChange} catalogEntry={catalogEntry}/>);

		const input = cmp.find('.identifier-input').first();

		expect(input.props().value).toEqual(identifier);

		input.simulate('change');

		expect(onChange).toHaveBeenCalledWith('ProviderUniqueID', identifier);
	});
});
