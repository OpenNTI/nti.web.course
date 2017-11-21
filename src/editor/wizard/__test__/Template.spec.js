import React from 'react';
import { mount } from 'enzyme';

import Template from '../Template';

/* eslint-env jest */
describe('Template test', () => {
	test('Test view', () => {
		const templateName = 'A TEMPLATE';
		const templateDescription = 'A DESCRIPTION';
		const onClick = jest.fn();

		const template = {
			name: templateName,
			description: templateDescription
		};

		const cmp = mount(<Template template={template} onClick={onClick}/>);

		expect(cmp.find('.template-name').first().text()).toEqual(templateName);
		expect(cmp.find('.template-description').first().text()).toEqual(templateDescription);

		cmp.simulate('click');

		expect(onClick).toHaveBeenCalled();
	});
});
