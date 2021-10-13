import { render, fireEvent } from '@testing-library/react';

import Edit from '../Edit';

/* eslint-env jest */
describe('Title edit test', () => {
	const onChange = jest.fn();

	test('Test title editor', () => {
		const title = 'A Title';

		const catalogEntry = {
			title: title,
		};

		const x = render(
			<Edit onValueChange={onChange} catalogEntry={catalogEntry} />
		);

		const input = x.container.querySelector('.title-input');

		expect(input.value).toEqual(title);

		fireEvent.change(input, { target: { value: 'new' } });

		expect(onChange).toHaveBeenCalledWith('title', 'new');
	});
});
