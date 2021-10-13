import { render } from '@testing-library/react';

import View from '../View';

/* eslint-env jest */
describe('Description view test', () => {
	test('Test description text', () => {
		const desc = 'DESC123';

		const catalogEntry = {
			description: desc,
		};

		const x = render(<View catalogEntry={catalogEntry} />);

		expect(
			x.container.querySelector('.course-view-description').textContent
		).toEqual(desc);
	});
});
