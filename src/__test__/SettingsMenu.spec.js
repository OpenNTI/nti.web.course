/* eslint-env jest */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { SettingsMenu } from '../SettingsMenu';

describe('Course SettingsMenu test', () => {
	const onEdit = jest.fn();
	const onExport = jest.fn();
	const onDelete = jest.fn();
	const onDrop = jest.fn();

	const course = {
		title: 'Test Course',
	};

	let result;
	beforeEach(async () => {
		result = render(
			<SettingsMenu
				course={course}
				onEdit={onEdit}
				onExport={onExport}
				onDelete={onDelete}
				onDrop={onDrop}
				supportLink="foo@bar.baz"
				registered
			/>
		);
	});

	const find = x => result.container.querySelector(x);
	const findAll = x => [...result.container.querySelectorAll(x)];

	const getOption = text => {
		let node = findAll('.option').find(n => n.textContent === text);

		return node;
	};

	const verifyOption = async (text, fn) => {
		const node = getOption(text);

		fireEvent.click(node);

		await waitFor(() => {
			expect(fn).toHaveBeenCalled();
		});
	};

	test('Test simple course with title', () => {
		let { container: simple } = render(<SettingsMenu course={course} />);

		expect(simple.querySelector('.course-name').textContent).toBe(
			course.title
		);

		// no registered status was provided, so there should be no registered message
		expect(simple.querySelector('.course-status').textContent).toBe('');

		// no action handlers were provided, so there should be only contact support
		expect(simple.querySelectorAll('.option')).toHaveLength(1);
	});

	test('All options present', () => {
		expect(findAll('.option')).toHaveLength(5);
	});

	test('Test edit option', async () =>
		verifyOption('Edit Course Information', onEdit));

	test('Test export option', async () => verifyOption('Export', onExport));

	test('Test delete option', async () =>
		verifyOption('Delete Course', onDelete));

	test('Test drop option', async () => verifyOption('Drop Course', onDrop));

	test('Test status', () => {
		expect(find('.course-status').textContent).toBe("You're Registered");
	});
});
