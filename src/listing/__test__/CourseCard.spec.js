import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import CourseCard from '../CourseCard';

/* eslint-env jest */
describe('CourseCard test', () => {
	const onClick = jest.fn();
	const onEdit = jest.fn();
	const mockTitle = 'Mock title';
	const mockID = 'Mock ID';

	const course = {
		getDefaultAssetRoot() {},
		title: mockTitle,
		ProviderUniqueID: mockID,
	};

	let result;
	beforeEach(() => {
		result = render(
			<CourseCard
				course={course}
				onClick={onClick}
				onEdit={onEdit}
				isAdministrative
			/>
		);
	});

	const find = x => result.container.querySelector(x);

	test('Test labels', () => {
		expect(find('.course-id').textContent).toEqual(mockID);
		expect(find('.course-title').textContent).toEqual(mockTitle);
	});

	test('Test card click', async () => {
		fireEvent.click(find('.course-item'));

		await waitFor(() => {
			expect(onClick).toHaveBeenCalled();
		});
	});
});
