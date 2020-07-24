import React from 'react';
import { mount } from 'enzyme';
import {RichText} from '@nti/web-editor';

import Edit from '../Edit';

/* eslint-env jest */
describe('Description edit test', () => {
	const onChange = jest.fn();

	xtest('Test description editor', () => {
		const desc = 'DESC123';

		const catalogEntry = {
			'RichDescription': desc
		};

		const cmp = mount(<Edit onValueChange={onChange} catalogEntry={catalogEntry}/>);

		const input = cmp.find(RichText).first();

		expect(input.props().value).toEqual(desc);

		input.simulate('change');

		expect(onChange).toHaveBeenCalledWith('RichDescription', desc);
	});
});
