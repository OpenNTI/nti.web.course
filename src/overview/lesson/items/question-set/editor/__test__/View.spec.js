/* eslint-env jest */
import React from 'react';
import { mount } from 'enzyme';

import View from '../View';

const wait = (x) => new Promise(f => setTimeout(f, x));

describe('Assignment editor view test', () => {
	test('Test empty assignment', async () => {
		const assignment = {
			hasLink: (rel) => {
				return rel === 'date-edit-start';
			},
			'available_for_submission_beginning': null,
			'available_for_submission_ending': null,
			PublicationState: null
		};

		const cmp = mount(<View assignment={assignment}/>);

		// draft is selected, there is no reset and due date editor is disabled
		expect(cmp.find('.draft-container').exists()).toBe(true);
		expect(cmp.find('.inline-reset-menu').exists()).toBe(false);

		const dueDateEditor = cmp.find('.inline-due-date-editor').first().find('.date-editor').first();

		expect(dueDateEditor.prop('className')).toMatch(/disabled/);
	});


	test('Test published assignment with due date and reset', async () => {
		const assignment = {
			hasLink: (rel) => {
				return rel === 'Reset';
			},
			'available_for_submission_beginning': new Date().getTime(),
			'available_for_submission_ending': new Date().getTime(),
			PublicationState: 'true'
		};

		const cmp = mount(<View assignment={assignment}/>);

		// publish is selected, there is no reset and due date editor is disabled
		expect(cmp.find('.publish-container').exists()).toBe(true);
		expect(cmp.find('.inline-reset-menu').exists()).toBe(true);

		const dueDateEditor = cmp.find('.inline-due-date-editor').first().find('.date-editor').first();

		expect(dueDateEditor.prop('className')).not.toMatch(/disabled/);
	});


	test('Test reset', async () => {
		let didReset = false;
		let didDismiss = false;

		const onDismiss = () => {
			didDismiss = true;
		};

		const assignment = {
			hasLink: (rel) => {
				return rel === 'Reset';
			},
			postToLink: (rel, data) => {
				if(rel === 'Reset') {
					didReset = true;
				}

				return Promise.resolve({});
			},
			refresh: () => {},
			'available_for_submission_beginning': new Date().getTime(),
			'available_for_submission_ending': new Date().getTime(),
			PublicationState: 'true'
		};

		const cmp = mount(<View assignment={assignment} onDismiss={onDismiss}/>);

		cmp.find('.inline-reset-menu').first().find('.publish-reset').first().simulate('click');

		await wait(200);

		expect(didReset).toBe(true);

		cmp.find('.footer').first().find('.cancel').first().simulate('click');

		await wait(200);

		expect(didDismiss).toBe(true);
	});


	test('Test scheduled assignment with due date', async () => {
		const now = new Date();
		const date = new Date('10/31/2018');
		const nextYear = now.getFullYear() + 1;

		date.setFullYear(nextYear);

		const assignment = {
			hasLink: (rel) => {
				return rel === 'date-edit-start';
			},
			'available_for_submission_beginning': date.getTime(),	// publish date should be on year from now
			'available_for_submission_ending': null,
			PublicationState: 'true'
		};

		const cmp = mount(<View assignment={assignment}/>);

		// schedule is selected and the scheduled date widget reflects the provided date
		expect(cmp.find('.schedule-container').exists()).toBe(true);
		expect(cmp.find('.inline-reset-menu').exists()).toBe(false);

		const scheduleDateEditor = cmp.find('.schedule-container').first().find('.date-editor').first();

		const datePattern = new RegExp('October.*31.*' + nextYear);

		expect(scheduleDateEditor.text()).toMatch(datePattern);
	});


	test('Test save scheduled', async () => {
		let didPublish = false;
		let startDate = null;
		let endDate = null;

		const assignment = {
			hasLink: (rel) => {
				return rel === 'date-edit-start' || rel === 'publish' || rel === 'date-edit';
			},
			postToLink: (rel, data) => {
				if(rel === 'publish') {
					didPublish = true;
				}

				return Promise.resolve({});
			},
			putToLink: (rel, data) => {
				startDate = new Date(data['available_for_submission_beginning'] * 1000);
				endDate = new Date(data['available_for_submission_ending'] * 1000);

				return Promise.resolve({});
			},
			refresh: () => {},
			'available_for_submission_beginning': null,
			'available_for_submission_ending': null,
			PublicationState: null
		};

		const cmp = mount(<View assignment={assignment}/>);

		const scheduledDate = new Date('10/25/2018');
		const dueDate = new Date('10/31/2018');

		cmp.setState({
			selectedPublishType: 'schedule',
			scheduledDate,
			dueDateChecked: true,
			dueDate
		});

		// simulates saving as scheduled, which should invoke a publish call and
		// a put that sets the scheduled date and due dates (since we specified a due date in the state)
		cmp.find('.save').simulate('click');

		await wait(200);

		expect(didPublish).toBe(true);

		expect(scheduledDate).toEqual(startDate);
		expect(endDate).toEqual(dueDate);
	});


	test('Test save draft', async () => {
		let didUnpublish = false;

		const assignment = {
			hasLink: (rel) => {
				return rel === 'date-edit-start' || rel === 'publish' || rel === 'date-edit';
			},
			postToLink: (rel, data) => {
				if(rel === 'unpublish') {
					didUnpublish = true;
				}

				return Promise.resolve({});
			},
			putToLink: (rel, data) => {
				return Promise.resolve({});
			},
			refresh: () => {},
			'available_for_submission_beginning': null,
			'available_for_submission_ending': null,
			PublicationState: null
		};

		const cmp = mount(<View assignment={assignment}/>);

		// simulates saving as a draft, which should invoke an unpublish call
		cmp.find('.save').simulate('click');

		await wait(200);

		expect(didUnpublish).toBe(true);
	});
});
