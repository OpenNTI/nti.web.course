import { render } from '@testing-library/react';

import View from '../View';

/* eslint-env jest */
describe('Tags view test', () => {
	test('Test tags text', () => {
		const tags = ['ab', 'cd', '12'];

		const catalogEntry = {
			tags,
		};

		const x = render(<View catalogEntry={catalogEntry} />);

		const tagCmps = x.container.querySelectorAll('.tag');

		expect(tagCmps.length).toBe(3);

		for (let i = 0; i < tags.length; i++) {
			expect(tagCmps[i].textContent).toEqual(tags[i]);
		}
	});
});
