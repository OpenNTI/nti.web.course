import { render } from '@testing-library/react';

import View from '../View';

/* eslint-env jest */
describe('Prerequisites view test', () => {
	test('Test prerequisite items', () => {
		const prereqs = [
			{
				id: 'id1',
				title: 'PR1',
			},
			{
				id: 'id2',
				title: 'PR2',
			},
		];

		const catalogEntry = {
			Prerequisites: prereqs,
		};

		const x = render(<View catalogEntry={catalogEntry} />);

		const items = x.container.querySelectorAll('.prerequisite');

		for (let i = 0; i < prereqs.length; i++) {
			expect(items[i].textContent).toEqual(prereqs[i].title);
		}
	});

	test('Test no items', () => {
		const catalogEntry = {};

		const x = render(<View catalogEntry={catalogEntry} />);

		expect(
			x.container.querySelector('.content-column').textContent
		).toEqual('None');
	});
});
