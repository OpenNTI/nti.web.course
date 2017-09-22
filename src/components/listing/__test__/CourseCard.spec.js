import React from 'react';
import { mount } from 'enzyme';

import CourseCard from '../CourseCard';

/* eslint-env jest */
describe('CourseCard test', () => {
	const onClick = jest.fn();
	const onEdit = jest.fn();
	const mockTitle = 'Mock title';
	const mockID = 'Mock ID';

	const course = {
		title: mockTitle,
		ProviderUniqueID: mockID
	};

	const cmp = mount(<CourseCard
		course={course}
		onClick={onClick}
		onEdit={onEdit}
		isAdministrative
	/>);

	test('Test labels', () => {
		expect(cmp.find('.course-id').first().text()).toEqual(mockID);
		expect(cmp.find('.course-title').first().text()).toEqual(mockTitle);
	});

	test('Test card click', (done) => {
		cmp.simulate('click');

		const verifyCalled = () => {
			expect(onClick).toHaveBeenCalled();

			done();
		};

		setTimeout(verifyCalled, 300);
	});
});
