import { render, fireEvent } from '@testing-library/react';

import Role from '../Role';

export const labels = {
	assistant: 'Grading Access',
	editor: 'Editing Access',
	instructor: 'Full Access',
};

/* eslint-env jest */
describe('Role test', () => {
	test('Test assistant', () => {
		const onClick = jest.fn();

		const x = render(<Role role="assistant" onClick={onClick} />);

		expect(x.container.textContent).toEqual(labels.assistant);

		fireEvent.click(x.container.querySelector('.role-option'));

		expect(onClick).toHaveBeenCalled();
	});

	test('Test Editor', () => {
		const onClick = jest.fn();

		const x = render(<Role role="editor" onClick={onClick} />);

		expect(x.container.textContent).toEqual(labels.editor);

		fireEvent.click(x.container.querySelector('.role-option'));

		expect(onClick).toHaveBeenCalled();
	});

	test('Test Instructor', () => {
		const onClick = jest.fn();

		const x = render(<Role role="instructor" onClick={onClick} />);

		expect(x.container.textContent).toEqual(labels.instructor);

		fireEvent.click(x.container.querySelector('.role-option'));

		expect(onClick).toHaveBeenCalled();
	});
});
