import React from 'react';
import { mount } from 'enzyme';

import Section from '../Section';
import { Title, Description, MeetTimes } from '../';

/* eslint-env jest */
describe('Section test', () => {
	test('Test view mode', () => {
		const title = 'Some title';
		const description = 'Some description';

		const catalogEntry = {
			title,
			description
		};

		const cmp = mount(<Section
			components={[Title, Description]}
			catalogEntry={catalogEntry}/>);

		expect(cmp.find('.course-view-title').first().text()).toEqual(title);
		expect(cmp.find('.course-view-description').first().text()).toEqual(description);
		expect(cmp.find('.edit-course-info').exists()).toBe(false);
	});

	test('Test view mode with no data', () => {
		const description = 'Some description';

		const catalogEntry = {
			description
		};

		const cmp = mount(<Section
			components={[MeetTimes]}
			catalogEntry={catalogEntry}/>);

		// if there is no data for the contents of the Section, then nothing should be rendered
		// this is so students don't see sections that aren't relevant to the course
		expect(cmp.html()).toBe(null);
	});

	test('Test edit mode', () => {
		const title = 'Some title';
		const description = 'Some description';

		const catalogEntry = {
			title,
			description
		};

		const cmp = mount(<Section
			components={[Title, Description]}
			catalogEntry={catalogEntry}
			editable/>);

		expect(cmp.find('.course-view-title').first().text()).toEqual(title);
		expect(cmp.find('.course-view-description').first().text()).toEqual(description);
		expect(cmp.find('.edit-course-info').exists()).toBe(true);
	});

	test('Test edit mode with no data', () => {
		const description = 'Some description';

		const catalogEntry = {
			description
		};

		const cmp = mount(<Section
			components={[Title]}
			catalogEntry={catalogEntry}
			editable/>);

		// unlike the View mode, editable sections with no data should still appear
		// in the event that the editor wants to add data to that section
		expect(cmp.find('.course-view-title').exists()).toBe(true);
		expect(cmp.find('.edit-course-info').exists()).toBe(true);
	});
});

/* eslint-env jest */
describe('Section interactivity test', () => {
	test('Test edit button', () => {
		const beginEditing = jest.fn();
		const title = 'Some title';
		const description = 'Some description';

		const catalogEntry = {
			title,
			description
		};

		const cmp = mount(<Section
			components={[Title, Description]}
			catalogEntry={catalogEntry}
			onBeginEditing={beginEditing}
			editable/>);

		const editButton = cmp.find('.edit-course-info').first();

		editButton.simulate('click');

		expect(beginEditing).toHaveBeenCalled();
	});

	test('Test save/cancel', (done) => {
		const endEditing = jest.fn();
		const mockSave = jest.fn();
		const title = 'Some title';
		const description = 'Some description';

		const titleToSave = 'new title';
		let actualSavedTitle;

		const catalogEntry = {
			title,
			description,
			save: (obj) => {
				mockSave();
				actualSavedTitle = obj.title;
				return Promise.resolve();
			}
		};

		const cmp = mount(<Section
			components={[Title, Description]}
			catalogEntry={catalogEntry}
			onEndEditing={endEditing}
			isEditing
			editable/>);

		const cancel = cmp.find('.cancel').first();

		cancel.simulate('click');

		expect(endEditing).toHaveBeenCalled();

		const save = cmp.find('.save').first();

		save.simulate('click');

		expect(endEditing).toHaveBeenCalled();
		expect(mockSave).not.toHaveBeenCalled();

		cmp.setState({pendingChanges: { title : titleToSave }});

		save.simulate('click');

		expect(endEditing).toHaveBeenCalled();

		setTimeout(() => {
			expect(mockSave).toHaveBeenCalled();
			expect(actualSavedTitle).toEqual(titleToSave);

			done();
		}, 500);
	});
});
