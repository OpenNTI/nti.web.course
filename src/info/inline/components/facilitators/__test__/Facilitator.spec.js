import React from 'react';
import { mount } from 'enzyme';

import Facilitator from '../Facilitator';

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

const display = 'User 1234';
const userName = 'user1234';
const title = 'Professor of bird law';

const facilitator = {
	visible: true,
	role: 'assistant',
	key: userName,
	Name: display,
	MimeType: 'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
	Class: 'CourseCatalogInstructorLegacyInfo',
	username: userName,
	JobTitle: title
};

const courseInstance = {
	hasLink: () => true
};

/* eslint-env jest */
describe('Facilitator component test', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	test('Test view', () => {
		const cmp = mount(<Facilitator facilitator={facilitator} courseInstance={courseInstance}/>);

		expect(cmp.find('.name').first().text()).toEqual(display);
		expect(cmp.find('.role').exists()).toBe(false); // view-only should not see roles
		expect(cmp.find('.title').first().text()).toEqual(title);
	});

	test('Test edit', () => {
		const onRemove = jest.fn();

		const cmp = mount(<Facilitator facilitator={facilitator} courseInstance={courseInstance} onRemove={onRemove} editable/>);

		expect(cmp.find('.name').first().text()).toEqual(display);
		expect(cmp.find('.role').first().text()).toEqual('Assistant');
		expect(cmp.find('.title').first().find('input').first().props().value).toEqual(title);

		cmp.find('.delete-facilitator').first().simulate('click');

		expect(onRemove).toHaveBeenCalledWith(facilitator);
	});
});
