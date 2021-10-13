import { render } from '@testing-library/react';

import TagInput from '../TagInput';

/* eslint-env jest */
describe('TagInput test', () => {
	test('Test existing value', () => {
		const values = ['abc', '123', 'def'];
		const x = render(<TagInput value={values} />);

		// there should be three tokens for the existing values
		const tokens = x.container.querySelectorAll('div.token');

		expect(tokens.length).toEqual(3);

		for (let i = 0; i < values.length; i++) {
			expect(tokens[i].textContent).toEqual(values[i]);
		}

		// there should be an input representing the next token as the user types
		const inputs = x.container.querySelectorAll('input');

		expect(inputs.length).toEqual(1);
	});
});
