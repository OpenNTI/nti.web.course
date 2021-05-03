import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import {
	setupTestClient,
	tearDownTestClient,
} from '@nti/web-client/test-utils';

import Edit from '../Edit';

const mockService = () => ({
	getObject: o => Promise.resolve(o),
});

const onBefore = () => {
	setupTestClient(mockService());
};

const onAfter = () => {
	tearDownTestClient();
};

const facilitators = [
	{
		role: 'assistant',
		visible: true,
		JobTitle: 'visible',
		Name: 'Visible Assistant',
		username: 'visibleAssistant',
		MimeType:
			'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
		Class: 'CourseCatalogInstructorLegacyInfo',
	},
	{
		role: 'editor',
		visible: false,
		JobTitle: 'hidden',
		Name: 'Hidden Editor',
		username: 'hiddenEditor',
		MimeType:
			'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
		Class: 'CourseCatalogInstructorLegacyInfo',
	},
];

/* eslint-env jest */
describe('Facilitators edit test', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	test('Test editable', () => {
		const courseInstance = {
			hasLink: l => l === 'Instructors' || l === 'Editors',
		};

		let newValues;

		function onValueChange(key, value) {
			newValues = value;
		}

		const x = render(
			<Edit
				facilitators={facilitators}
				courseInstance={courseInstance}
				onValueChange={onValueChange}
			/>
		);

		const facilitatorItems = x.container.querySelectorAll(
			'.facilitator.edit'
		);

		expect(facilitatorItems.length).toBe(2);

		const deleteBtn = x.container.querySelector('.delete-facilitator');

		fireEvent.click(deleteBtn);
		const [visibleAssistant] = newValues.filter(
			({ key }) => key === 'visibleAssistant'
		);

		expect(visibleAssistant.role).toEqual(''); // empty role flags for removal
	});

	test('Test non-editable (assistant role)', () => {
		const courseInstance = {
			hasLink: l => l === 'Instructors',
		};

		const x = render(
			<Edit facilitators={facilitators} courseInstance={courseInstance} />
		);

		const editableItems = x.container.querySelectorAll('.facilitator.edit');

		// only Instructor role should be able to edit
		expect(editableItems.length).toBe(0);

		const facilitatorItems = x.container.querySelectorAll('.facilitator');

		expect(facilitatorItems.length).toBe(2);
	});

	test('Test non-editable (editor role)', () => {
		const courseInstance = {
			hasLink: l => l === 'Editors',
		};

		const x = render(
			<Edit facilitators={facilitators} courseInstance={courseInstance} />
		);

		const editableItems = x.container.querySelectorAll('.facilitator.edit');

		// only Instructor role should be able to edit
		expect(editableItems.length).toBe(0);

		const facilitatorItems = x.container.querySelectorAll('.facilitator');

		expect(facilitatorItems.length).toBe(2);
	});
});
