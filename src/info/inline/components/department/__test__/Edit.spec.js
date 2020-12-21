import React from 'react';
import { render } from '@testing-library/react';

import Edit from '../Edit';

/* eslint-env jest */
describe('Department edit test', () => {
	// Currently, there is no department editor
	test('Test that it does nothing!', () => {
		const depName = 'ABC123';

		const catalogEntry = {
			'ProviderDepartmentTitle': depName
		};

		const x = render(<Edit catalogEntry={catalogEntry}/>);

		expect(x.container.innerHTML).toEqual('<div></div>');
	});
});
