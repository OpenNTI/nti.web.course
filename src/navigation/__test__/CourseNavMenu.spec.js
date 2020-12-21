import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import CourseNavMenu from '../CourseNavMenu';

/* eslint-env jest */
describe('CourseNavMenu test', () => {
	const activeCourse = {
		title: 'Active Course',
		thumb: '/active/url',
		subItems: [
			{
				title: 'Section 1'
			},
			{
				title: 'Section 2',
				cls: 'current'
			}
		]
	};

	const recentCourses = [
		{
			title: 'Course 1',
			thumb: '/some/url1'
		},
		{
			title: 'Course 1',
			thumb: '/some/url2'
		}
	];

	const verifyContents = (el) => {
		const activeCourseEl = el.querySelector('.active-content');

		const activeTitle = activeCourseEl.querySelector('.title');

		expect(activeCourseEl.querySelector('img').getAttribute('src')).toEqual('/active/url');

		expect(activeTitle.textContent).toEqual('Active Course');

		const sections = el.querySelectorAll('.sections-list .section');

		expect(sections[0].textContent).toEqual('Section 1');
		expect(sections[0].getAttribute('class')).not.toMatch(/current/);

		expect(sections[1].textContent).toEqual('Section 2');
		expect(sections[1].getAttribute('class')).toMatch(/current/);

		const recentCoursesList = el.querySelectorAll('.recent-content-items-list .recent-content');

		expect(recentCoursesList[0].querySelector('img').getAttribute('src')).toEqual('/some/url1');
		expect(recentCoursesList[1].querySelector('img').getAttribute('src')).toEqual('/some/url2');
	};

	test('Test non-admin', () => {
		const {container: root} = render(
			<CourseNavMenu
				activeCourse={activeCourse}
				recentCourses={recentCourses}/>
		);

		verifyContents(root);

		expect(root.querySelector('.delete-content')).toBeFalsy();
		expect(root.querySelector('.edit')).toBeFalsy();
		expect(root.querySelector('.publish')).toBeFalsy();
	});

	test('Test admin', () => {
		const onItemClick = jest.fn();
		const goToEditor = jest.fn();

		const {container: root} = render(
			<CourseNavMenu
				activeCourse={activeCourse}
				recentCourses={recentCourses}
				onItemClick={onItemClick}
				goToEditor={goToEditor}
				isAdministrator
				isEditor
			/>
		);

		verifyContents(root);

		expect(root.querySelector('.delete-content')).toBeTruthy();

		const edit = root.querySelector('.edit');
		fireEvent.click(edit);
		expect(goToEditor).toHaveBeenCalled();

		const recentCourse1 = root.querySelector('.recent-content');

		fireEvent.click(recentCourse1);

		expect(onItemClick).toHaveBeenCalled();
	});
});
