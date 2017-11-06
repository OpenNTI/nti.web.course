import React from 'react';
import { mount } from 'enzyme';

import Edit from '../Edit';

/* eslint-env jest */
describe('Department edit test', () => {
	// Currently, there is no department editor
	test('Test that it does nothing!', () => {
		const depName = 'ABC123';

		const catalogEntry = {
			'ProviderDepartmentTitle': depName
		};

		const cmp = mount(<Edit catalogEntry={catalogEntry}/>);

		expect(cmp.html()).toEqual('<div></div>');
	});
});
