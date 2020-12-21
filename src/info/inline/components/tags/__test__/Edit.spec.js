import React from 'react';
import { render } from '@testing-library/react';

import Edit from '../Edit';

/* eslint-env jest */
describe('Tags edit test', () => {
	test('Test tags editor', () => {
		const tags = ['ab', 'cd', '12'];

		const catalogEntry = {
			tags
		};

		const x = render(<Edit catalogEntry={catalogEntry}/>);

		const tokens = x.container.querySelectorAll('div.token');

		expect(tokens.length).toEqual(3);

		for(let i = 0; i < tags.length; i++) {
			expect(tokens[i].textContent).toEqual(tags[i].toUpperCase());
		}

		// there should be an input representing the next token as the user types
		const inputs = x.container.querySelectorAll('input');

		expect(inputs.length).toEqual(1);
	});
});
