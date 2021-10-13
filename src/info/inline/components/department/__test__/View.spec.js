import { render } from '@testing-library/react';

import View from '../View';

/* eslint-env jest */
describe('Department view test', () => {
	test('Test department name', () => {
		const depName = 'ABC123';

		const catalogEntry = {
			ProviderDepartmentTitle: depName,
		};

		const x = render(<View catalogEntry={catalogEntry} />);

		expect(
			x.container.querySelector('.content-column').textContent
		).toEqual(depName);
	});
});
