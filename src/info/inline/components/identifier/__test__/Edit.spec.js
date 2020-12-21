import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import Edit from '../Edit';

/* eslint-env jest */
describe('Department edit test', () => {
	const onChange = jest.fn();

	test('Test identifier edit', async () => {
		const identifier = 'ABC123';

		const catalogEntry = {
			'ProviderUniqueID': identifier
		};

		const {container} = render(<Edit onValueChange={onChange} catalogEntry={catalogEntry}/>);

		const input = container.querySelector('input.identifier-input');

		expect(input.value).toEqual(identifier);

		fireEvent.change(input, {target: {value: 'nope'}});

		await waitFor(() =>
			expect(onChange).toHaveBeenCalledWith('ProviderUniqueID', 'nope'));
	});
});
