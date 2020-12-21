import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Edit from '../Edit';

/* eslint-env jest */
describe('Description edit test', () => {
	const onChange = jest.fn();

	xtest('Test description editor', () => {
		const desc = 'DESC123';

		const catalogEntry = {
			'RichDescription': desc
		};

		const x = render(<Edit onValueChange={onChange} catalogEntry={catalogEntry}/>);
		const input = x.container.querySelector('.rich-text-editor');

		expect(input.textContent).toEqual(desc);

		fireEvent.change(input);

		expect(onChange).toHaveBeenCalledWith('RichDescription', desc);
	});
});
