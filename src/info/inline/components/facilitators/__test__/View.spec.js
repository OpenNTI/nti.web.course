import React from 'react';
import { mount } from 'enzyme';

import View from '../View';

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

const courseInstance = {
	hasLink: () => false
};

/* eslint-env jest */
describe('Facilitators view test', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	test('Test non-editor view', () => {
		const cmp = mount(<View facilitators={facilitators} courseInstance={courseInstance}/>);

		const items = cmp.find('.facilitator');

		expect(items.first().find('.name').first().text()).toEqual('Visible Assistant');
		expect(items.first().find('.type').exists()).toBe(false); // view-only should not see role
		expect(items.first().find('.title').first().text()).toEqual('visible');
	});

	test('Test editor view', () => {
		const cmp = mount(<View facilitators={facilitators} courseInstance={courseInstance} editable/>);

		const items = cmp.find('.facilitator');

		expect(items.first().find('.name').first().text()).toEqual('Visible Assistant');
		expect(items.first().find('.title').first().text()).toEqual('visible');
	});
});
