import React from 'react';
import { render } from '@testing-library/react';

import {
	setupTestClient,
	tearDownTestClient,
} from '@nti/web-client/test-utils';

import View from '../View';

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

const courseInstance = {
	hasLink: () => false,
};

/* eslint-env jest */
describe('Facilitators view test', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	test('Test non-editor view', () => {
		const x = render(
			<View facilitators={facilitators} courseInstance={courseInstance} />
		);

		const find = _ => x.container.querySelector(`.facilitator ${_}`);

		expect(find('.name').textContent).toEqual('Visible Assistant');
		expect(find('.type')).toBeFalsy(); // view-only should not see role
		expect(find('.title').textContent).toEqual('visible');
	});

	test('Test editor view', () => {
		const x = render(
			<View
				facilitators={facilitators}
				courseInstance={courseInstance}
				editable
			/>
		);

		const find = _ => x.container.querySelector(`.facilitator ${_}`);

		expect(find('.name').textContent).toEqual('Visible Assistant');
		expect(find('.title').textContent).toEqual('visible');
	});
});
