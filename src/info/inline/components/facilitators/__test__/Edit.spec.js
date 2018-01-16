import React from 'react';
import { mount } from 'enzyme';

import Edit from '../Edit';

const mockService = () => ({
	getObject: (o) => Promise.resolve(o)
});

const onBefore = () => {
	global.$AppConfig = {
		...(global.$AppConfig || {}),
		nodeService: mockService(),
		nodeInterface: {
			getServiceDocument: () => Promise.resolve(global.$AppConfig.nodeService)
		}
	};
};

const onAfter = () => {
	//unmock getService()
	const {$AppConfig} = global;
	delete $AppConfig.nodeInterface;
	delete $AppConfig.nodeService;
};

const facilitators = [
	{
		role: 'assistant',
		visible: true,
		JobTitle: 'visible',
		Name: 'Visible Assistant',
		username: 'visibleAssistant',
		MimeType: 'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
		Class: 'CourseCatalogInstructorLegacyInfo'
	},
	{
		role: 'editor',
		visible: false,
		JobTitle: 'hidden',
		Name: 'Hidden Editor',
		username: 'hiddenEditor',
		MimeType: 'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
		Class: 'CourseCatalogInstructorLegacyInfo'
	}
];

/* eslint-env jest */
describe('Facilitators edit test', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	test('Test editable', () => {
		const courseInstance = {
			hasLink: (l) => l === 'Instructors' || l === 'Editors'
		};

		let newValues;

		function onValueChange (key, value) {
			newValues = value;
		}

		const cmp = mount(<Edit facilitators={facilitators} courseInstance={courseInstance} onValueChange={onValueChange}/>);

		const facilitatorItems = cmp.find('.facilitator.edit');

		expect(facilitatorItems.length).toBe(2);

		const deleteBtn = cmp.find('.delete-facilitator').first();

		deleteBtn.simulate('click');
		const visibleAssistant = newValues.filter(x => x.key === 'visibleAssistant')[0];

		expect(visibleAssistant.role).toEqual(''); // empty role flags for removal
	});

	test('Test non-editable (assistant role)', () => {
		const courseInstance = {
			hasLink: (l) => l === 'Instructors'
		};

		const cmp = mount(<Edit facilitators={facilitators} courseInstance={courseInstance}/>);

		const editableItems = cmp.find('.facilitator.edit');

		// only Insturctor role should be able to edit
		expect(editableItems.exists()).toBe(false);

		const facilitatorItems = cmp.find('.facilitator');

		expect(facilitatorItems.length).toBe(2);
	});

	test('Test non-editable (editor role)', () => {
		const courseInstance = {
			hasLink: (l) => l === 'Editors'
		};

		const cmp = mount(<Edit facilitators={facilitators} courseInstance={courseInstance}/>);

		const editableItems = cmp.find('.facilitator.edit');

		// only Insturctor role should be able to edit
		expect(editableItems.exists()).toBe(false);

		const facilitatorItems = cmp.find('.facilitator');

		expect(facilitatorItems.length).toBe(2);
	});
});
