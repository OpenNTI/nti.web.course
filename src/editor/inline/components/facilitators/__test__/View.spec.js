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

		const facilitatorInfos = cmp.find('.facilitator-info');

		expect(facilitatorInfos.length).toBe(1); // only one visible, hidden should not show on non-editor view
		expect(facilitatorInfos.first().find('.name').first().text()).toEqual('Visible Assistant');
		expect(facilitatorInfos.first().find('.type').first().text()).toEqual('Assistant');
		expect(facilitatorInfos.first().find('.title').first().text()).toEqual('visible');
	});

	test('Test editor view', () => {
		const cmp = mount(<View facilitators={facilitators} courseInstance={courseInstance} editable/>);

		const facilitatorInfos = cmp.find('.facilitator-info');

		expect(facilitatorInfos.length).toBe(2); // only one visible, hidden should not show on non-editor view
		expect(facilitatorInfos.first().find('.name').first().text()).toEqual('Visible Assistant');
		expect(facilitatorInfos.first().find('.type').first().text()).toEqual('Assistant');
		expect(facilitatorInfos.first().find('.title').first().text()).toEqual('visible');

		expect(facilitatorInfos.at(1).find('.name').first().text()).toEqual('Hidden Editor');
		expect(facilitatorInfos.at(1).find('.type').first().text()).toEqual('Editor');
		expect(facilitatorInfos.at(1).find('.title').first().text()).toEqual('hidden');
	});
});
