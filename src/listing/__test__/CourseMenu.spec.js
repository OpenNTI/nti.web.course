import React from 'react';
import { mount } from 'enzyme';

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

	const cmp = mount(<CourseMenu
		course={course}
		doEdit={doEdit}
		doExport={doExport}
		doDelete={doDelete}
		doDrop={doDrop}
		doRequestSupport={doRequestSupport}
		registered="registered"
	/>);

	const getOption = (component, text) => {
		let node = component.findWhere(n => n.is('.option') && n.text() === text);

		return node;
	};

	const verifyOption = (text, fn, done) => {
		let node = getOption(cmp, text);

		node.simulate('click');

		const doAssertions = () => {
			expect(fn).toHaveBeenCalled();

			done();
		};

		setTimeout(doAssertions(), 300);
	};

	test('Test simple course with title', () => {
		let simple = mount(<CourseMenu course={course}/>);

		expect(simple.find('.course-name').first().text()).toBe(course.title);

		// no registered status was provided, so there should be no registered message
		expect(simple.find('.course-status').first().text()).toBe('');

		// no action handlers were provided, so there should be no options
		expect(simple.find('.option')).toHaveLength(0);
	});

	test('All options present', () => {
		expect(cmp.find('.option')).toHaveLength(5);
	});

	test('Test edit option', (done) => {
		verifyOption('Edit Course Information', doEdit, done);
	});

	test('Test export option', (done) => {
		verifyOption('Export', doExport, done);
	});

	test('Test support option', (done) => {
		verifyOption('Contact Support', doRequestSupport, done);
	});

	test('Test delete option', (done) => {
		verifyOption('Delete Course', doDelete, done);
	});

	test('Test drop option', (done) => {
		verifyOption('Drop Course', doDrop, done);
	});

	test('Test status', () => {
		expect(cmp.find('.course-status').first().text()).toBe('You\'re Registered');
	});
});
