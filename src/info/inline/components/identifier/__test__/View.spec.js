import React from 'react';
import { render } from '@testing-library/react';

import View from '../View';

/* eslint-env jest */
describe('Department view test', () => {
	test('Test department name', () => {
		const identifier = 'ABC123';

		const catalogEntry = {
			'ProviderUniqueID': identifier
		};

		const x = render(<View catalogEntry={catalogEntry}/>);

		expect(x.container.querySelector('.course-view-identifier').textContent).toEqual(identifier);
	});
});
