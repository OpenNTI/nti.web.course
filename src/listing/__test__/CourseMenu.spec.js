import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import CourseMenu from '../CourseMenu';

/* eslint-env jest */
describe('CourseMenu test', () => {
	const doEdit = jest.fn();
	const doExport = jest.fn();
	const doDelete = jest.fn();
	const doDrop = jest.fn();
	const doRequestSupport = jest.fn();

	const course = {
		title: 'Test Course'
	};

	let result;
	beforeEach(() => {
		result = render(<CourseMenu
			course={course}
			doEdit={doEdit}
			doExport={doExport}
			doDelete={doDelete}
			doDrop={doDrop}
			doRequestSupport={doRequestSupport}
			registered="registered"
		/>);
	});

	const find = x => result.container.querySelector(x);
	const findAll = x => [...result.container.querySelectorAll(x)];

	const getOption = (text) => {
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
		let {container: simple} = render(<CourseMenu course={course}/>);

		expect(simple.querySelector('.course-name').textContent).toBe(course.title);

		// no registered status was provided, so there should be no registered message
		expect(simple.querySelector('.course-status').textContent).toBe('');

		// no action handlers were provided, so there should be no options
		expect(simple.querySelectorAll('.option')).toHaveLength(0);
	});

	test('All options present', () => {
		expect(findAll('.option')).toHaveLength(5);
	});

	test('Test edit option', async () =>
		verifyOption('Edit Course Information', doEdit));

	test('Test export option', async () =>
		verifyOption('Export', doExport));

	test('Test support option', async () =>
		verifyOption('Contact Support', doRequestSupport));

	test('Test delete option', async () =>
		verifyOption('Delete Course', doDelete));

	test('Test drop option', async () =>
		verifyOption('Drop Course', doDrop));

	test('Test status', () => {
		expect(find('.course-status').textContent).toBe('You\'re Registered');
	});
});
