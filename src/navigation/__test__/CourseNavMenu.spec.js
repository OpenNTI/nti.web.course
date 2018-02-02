import React from 'react';
import { mount } from 'enzyme';

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

	const verifyContents = (cmp) => {
		const activeCourseEl = cmp.find('.active-course').first();

		const activeTitle = activeCourseEl.find('.title').first();

		expect(activeCourseEl.find('img').prop('src')).toEqual('/active/url');

		expect(activeTitle.text()).toEqual('Active Course');

		const sections = cmp.find('.sections-list').first().find('.section');

		expect(sections.at(0).text()).toEqual('Section 1');
		expect(sections.at(0).prop('className')).not.toMatch(/current/);

		expect(sections.at(1).text()).toEqual('Section 2');
		expect(sections.at(1).prop('className')).toMatch(/current/);

		const recentCoursesList = cmp.find('.recent-courses-list').first().find('.recent-course');

		expect(recentCoursesList.at(0).find('img').first().prop('src')).toEqual('/some/url1');
		expect(recentCoursesList.at(1).find('img').first().prop('src')).toEqual('/some/url2');
	};

	test('Test non-admin', () => {
		const cmp = mount(
			<CourseNavMenu
				activeCourse={activeCourse}
				recentCourses={recentCourses}/>
		);

		verifyContents(cmp);

		expect(cmp.find('.delete-course').exists()).toBe(false);
		expect(cmp.find('.edit').exists()).toBe(false);
		expect(cmp.find('.publish').exists()).toBe(false);
	});

	test('Test admin', () => {
		const onItemClick = jest.fn();
		const goToEditor = jest.fn();

		const cmp = mount(
			<CourseNavMenu
				activeCourse={activeCourse}
				recentCourses={recentCourses}
				onItemClick={onItemClick}
				goToEditor={goToEditor}
				isAdministrator/>
		);

		verifyContents(cmp);

		expect(cmp.find('.delete-course').exists()).toBe(true);

		const edit = cmp.find('.edit').first();

		edit.simulate('click');

		expect(goToEditor).toHaveBeenCalled();

		const recentCourse1 = cmp.find('.recent-course').first();

		recentCourse1.simulate('click');

		expect(onItemClick).toHaveBeenCalled();
	});
});
