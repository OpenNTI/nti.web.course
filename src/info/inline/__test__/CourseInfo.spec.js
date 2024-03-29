// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react';
import {
	setupTestClient,
	tearDownTestClient,
} from '@nti/web-client/test-utils';

// import CourseInfo from '../CourseInfo';

const redemptionCodes = [{ Code: 'abc-def' }];

const courseInstance = {
	getAccessTokens: () => {
		return Promise.resolve(redemptionCodes);
	},
	hasLink: () => true,
	getLink: l => l,
};

const mockService = () => ({
	getObject: o => Promise.resolve(courseInstance),
	get: o => Promise.resolve(courseInstance),
});

const onBefore = () => {
	setupTestClient(mockService(), 'TestUser');
};

const onAfter = () => {
	tearDownTestClient();
};

/* eslint-env jest */
describe('CourseInfo test', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	// const startDate = new Date('2016-06-13T05:00:00Z');

	test.skip('Test editable', () => {
		// 	const title = 'a title';
		// 	const catalogEntry = {
		// 		title,
		// 		StartDate: startDate,
		// 		getStartDate: () => startDate,
		// 		getEndDate: () => null,
		// 		getLink: () => null,
		// 		getEnrollmentOptions: () => {},
		// 		getDefaultAssetRoot: () => ''
		// 	};
		//
		// 	const results = render(<CourseInfo catalogEntry={catalogEntry} editable/>);
		//
		// 	expect(cmp.find('.loading').exists()).toBe(true);
		//
		// 	// manually initialize the data to get out of the loading state
		// 	cmp.setState({
		// 		catalogEntry,
		// 		courseInstance,
		// 		redemptionCodes,
		// 		loading: false
		// 	});
		//
		// 	cmp.update();
		//
		// 	expect(cmp.find('.loading').exists()).toBe(false);
		//
		// 	const basicInfoView = cmp.find('.basic-info-section');
		//
		// 	expect(cmp.find('.course-visibility').first().exists()).toBe(true);
		// 	expect(basicInfoView.find('.section-controls').exists()).toBe(false);
		// 	expect(cmp.find('.course-view-title').first().text()).toEqual(title);
		//
		// 	const testEditorActivation = (name, className) => {
		// 		// find and click the Edit button for this section
		// 		const editButton = cmp.find(className).first().find('.edit-course-info');
		// 		editButton.simulate('click');
		// 		cmp.update();
		//
		// 		// verify that the section is in edit mode and that it is the only section
		// 		// in edit mode (only one allowed at a time currently)
		// 		const sectionEdit = cmp.find(className);
		// 		const sectionControls = cmp.find('.section-controls');
		//
		// 		expect(sectionControls.length).toBe(1);
		// 		expect(sectionEdit.find('.section-controls').exists()).toBe(true);
		//
		// 		// find and click the cancel button to go back out of edit mode
		// 		const cancelButton = sectionEdit.find('.section-controls').first().find('.cancel');
		// 		cancelButton.simulate('click');
		// 		cmp.update();
		//
		// 		// verify that nothing on the editor is in edit mode now
		// 		expect(cmp.find('.section-controls').exists()).toBe(false);
		// 	};
		//
		// 	testEditorActivation('CourseInfo', '.basic-info-section');
		// 	testEditorActivation('StartDate', '.start-date-section');
		// 	testEditorActivation('EndDate', '.end-date-section');
		// 	testEditorActivation('MeetTimes', '.meet-times-section');
		// });
		//
		// test('Test non-editable', () => {
		// 	const title = 'a title';
		// 	const catalogEntry = {
		// 		title,
		// 		StartDate: startDate,
		// 		getStartDate: function () {
		// 			return startDate;
		// 		},
		// 		getEndDate: function () {
		// 			return null;
		// 		},
		// 		getLink: function () {
		// 			return null;
		// 		},
		// 		getEnrollmentOptions: function () {
		// 			return {};
		// 		}
		// 	};
		//
		// 	const cmp = render(<CourseInfo catalogEntry={catalogEntry}/>);
		//
		// 	cmp.setState({
		// 		catalogEntry,
		// 		courseInstance,
		// 		redemptionCodes,
		// 		loading: false
		// 	});
		//
		// 	cmp.update();
		//
		// 	// course visibility widget should not appear when info is not editable
		// 	expect(cmp.find('.course-visibility').exists()).toBe(false);
	});
});
