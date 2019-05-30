import React from 'react';
import { mount } from 'enzyme';

import Facilitator from '../Facilitator';

import {labels} from './Role.spec';

const wait = x => new Promise(f => setTimeout(f, x));

const mockService = () => ({
	getObject: (o) => Promise.resolve(o),
	get: (url) => {
		if(url === 'badURL') {
			return Promise.reject('Bad URL');
		}

		return Promise.resolve();
	}
});

const onBefore = () => {
	global.$AppConfig = {
		...(global.$AppConfig || {}),
		username: 'TestUser',
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
	Biography: 'I started studying bird law back in 1995',
	MimeType: 'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
	Class: 'CourseCatalogInstructorLegacyInfo',
	username: userName,
	JobTitle: title,
	imageUrl: 'goodURL'
};

const courseInstance = {
	hasLink: () => true
};

/* eslint-env jest */
describe('Facilitator component test', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	test('Test view', async () => {
		const cmp = mount(<Facilitator facilitator={facilitator} courseInstance={courseInstance}/>);

		expect(cmp.find('.name').first().text()).toEqual(display);
		expect(cmp.find('.role').exists()).toBe(false); // view-only should not see roles
		expect(cmp.find('.title').first().text()).toEqual(title);

		await wait(100);

		cmp.update();

		expect(cmp.state().validImage).toBe(true);

		expect(cmp.find('.image').first().prop('style').backgroundImage).toEqual('url(goodURL)');

	});

	test('Test edit', () => {
		const onRemove = jest.fn();

		const cmp = mount(<Facilitator facilitator={facilitator} courseInstance={courseInstance} onRemove={onRemove} editable/>);

		expect(cmp.find('.name').first().text()).toEqual(display);
		expect(cmp.find('.role').first().text()).toEqual(labels.assistant);
		expect(cmp.find('.title .job-title-input').first().props().value).toEqual(title);

		cmp.find('.delete-facilitator').first().simulate('click');

		expect(onRemove).toHaveBeenCalledWith(facilitator);
	});

	test('Test invalid image', (done) => {
		const facilitatorBadImage = {
			...facilitator,
			imageUrl: 'badURL'
		};

		const cmp = mount(<Facilitator facilitator={facilitatorBadImage} courseInstance={courseInstance}/>);

		expect(cmp.find('.name').first().text()).toEqual(display);
		expect(cmp.find('.role').exists()).toBe(false); // view-only should not see roles
		expect(cmp.find('.title').first().text()).toEqual(title);

		setTimeout(() => {
			// verify that the image validation failed
			expect(cmp.state().validImage).toBe(false);

			// update props with facilitator with valid image URL
			cmp.setProps({facilitator});

			setTimeout(() => {
				// verify that the image validation passed now
				expect(cmp.state().validImage).toBe(true);

				done();
			}, 200);
		}, 200);
	});

	test('Test self user', () => {
		const myUser = {
			...facilitator,
			username: 'TestUser'
		};

		const cmp = mount(<Facilitator facilitator={myUser} courseInstance={courseInstance} editable/>);

		expect(cmp.find('.name').first().text()).toEqual(display);
		expect(cmp.find('.role').first().text()).toEqual(labels.assistant);
		expect(cmp.find('.title .job-title-input').first().props().value).toEqual(title);

		expect(cmp.find('.delete-facilitator').exists()).toBe(true);
	});
});
