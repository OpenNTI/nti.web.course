import React from 'react';
import { mount } from 'enzyme';

import Edit from '../Edit';

/* eslint-env jest */
describe('Department edit test', () => {
	// Currently, there is no identifier editor
	test('Test that it does nothing!', () => {
		const identifier = 'ABC123';

		const catalogEntry = {
			'ProviderUniqueID': identifier
		};

		const cmp = mount(<Edit catalogEntry={catalogEntry}/>);

		expect(cmp.html()).toEqual(null);
	});
});
