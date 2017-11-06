import React from 'react';
import { mount } from 'enzyme';

import View from '../View';

/* eslint-env jest */
describe('Prerequisites view test', () => {
	test('Test prerequisite items', () => {
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

		const cmp = mount(<View catalogEntry={catalogEntry}/>);

		const items = cmp.find('.prerequisite');

		for(let i = 0; i < prereqs.length; i++) {
			expect(items.at(i).text()).toEqual(prereqs[i].title);
		}
	});

	test('Test no items', () => {
		const catalogEntry = {};

		const cmp = mount(<View catalogEntry={catalogEntry}/>);

		expect(cmp.find('.content-column').first().text()).toEqual('None');
	});
});
