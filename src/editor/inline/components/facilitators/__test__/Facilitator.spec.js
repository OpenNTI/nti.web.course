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
	role: 'facilitator',
	key: userName,
	Name: display,
	MimeType: 'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
	Class: 'CourseCatalogInstructorLegacyInfo',
	username: userName,
	JobTitle: title
};

/* eslint-env jest */
describe('Facilitator component test', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	test('Test view', () => {
		const cmp = mount(<Facilitator facilitator={facilitator}/>);

		expect(cmp.find('.name').first().text()).toEqual(display);
		expect(cmp.find('.type').first().text()).toEqual('Facilitator');
		expect(cmp.find('.title').first().text()).toEqual(title);
	});

	test('Test edit', () => {
		const onRemove = jest.fn();

		const cmp = mount(<Facilitator facilitator={facilitator} onRemove={onRemove} editable/>);

		expect(cmp.find('.name').first().text()).toEqual(display);
		expect(cmp.find('.type').first().text()).toEqual('Facilitator');
		expect(cmp.find('.title').first().text()).toEqual(title);

		cmp.find('.delete-facilitator').first().simulate('click');

		expect(onRemove).toHaveBeenCalledWith(facilitator);
	});
});
