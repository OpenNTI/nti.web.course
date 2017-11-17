import React from 'react';
import { mount } from 'enzyme';

import Edit from '../Edit';

/* eslint-env jest */
describe('Prerequisites edit test', () => {
	// Currently, there is no department editor
	test('Test that it does nothing!', () => {
		const prereqs = [
			{
				id: 'id1',
				title: 'PR1'
			},
			{
				id: 'id2',
				title: 'PR2'
			}
		];

		const catalogEntry = {
			'Prerequisites': prereqs
		};

		const cmp = mount(<Edit catalogEntry={catalogEntry}/>);

		expect(cmp.html()).toEqual('<div></div>');
	});
});
