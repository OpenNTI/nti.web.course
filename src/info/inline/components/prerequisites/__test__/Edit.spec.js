import React from 'react';
import { render } from '@testing-library/react';

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

		const x = render(<Edit catalogEntry={catalogEntry}/>);

		expect(x.container.innerHTML).toEqual('<div></div>');
	});
});
