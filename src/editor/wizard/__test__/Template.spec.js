import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import Template from '../Template';

/* eslint-env jest */
describe('Template test', () => {
	test('Test view', async () => {
		const templateName = 'A TEMPLATE';
		const templateDescription = 'A DESCRIPTION';
		const onClick = jest.fn();

		const template = {
			name: templateName,
			description: templateDescription
		};

		const {container: root} = render(<Template template={template} onClick={onClick}/>);

		expect(root.querySelector('.template-name').textContent).toEqual(templateName);
		expect(root.querySelector('.template-description').textContent).toEqual(templateDescription);

		fireEvent.click(root.querySelector('.item'));

		await waitFor(() =>
			expect(onClick).toHaveBeenCalled());
	});
});
