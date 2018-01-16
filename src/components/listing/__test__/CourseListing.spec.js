import React from 'react';
import { mount } from 'enzyme';

import CourseListing from '../CourseListing';

const mockService = () => ({
	get: function (url) {
		if(url === 'coursesURL') {
			return Promise.resolve({
				Items: [
					{
						title: 'Course1',
						ProviderUniqueID: 'CRS1'
					},
					{
						title: 'Course2',
						ProviderUniqueID: 'CRS2'
					}
				]
			});
		}
	},
	getObject: function (objects) {
		return Promise.resolve(objects);
	},
	getCollection: function (name, subname) {
		if(name === 'AllCourses' && subname === 'Courses') {
			return {
				href: 'coursesURL'
			};
		}
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

/* eslint-env jest */
describe('CourseListing test', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	test('Test admin load and display courses', (done) => {
		const onClick = jest.fn();

		const cmp = mount(<CourseListing
			onCourseClick={onClick}
			isAdministrative
		/>);

		expect(cmp.state().loading).toBe(true);
		expect(cmp.find('.loading').first().exists()).toBe(true);

		setTimeout(function () {
			expect(cmp.state().loading).toBe(false);

			expect(cmp.find('.course-meta').at(0).text()).toEqual('CRS1Course1');
			expect(cmp.find('.course-meta').at(1).text()).toEqual('CRS2Course2');

			// there should be admin controls on each card
			expect(cmp.find('.admin-controls').length).toBe(2);

			// admins should be able to click cards
			cmp.find('.course-item').first().simulate('click');

			expect(onClick).toHaveBeenCalled();

			done();
		}, 200);
	});

	test('Test non-admin load and display courses', (done) => {
		const onClick = jest.fn();

		const cmp = mount(<CourseListing
			onCourseClick={onClick}
		/>);

		expect(cmp.state().loading).toBe(true);
		expect(cmp.find('.loading').first().exists()).toBe(true);

		setTimeout(function () {
			expect(cmp.state().loading).toBe(false);

			expect(cmp.find('.course-meta').at(0).text()).toEqual('CRS1Course1');
			expect(cmp.find('.course-meta').at(1).text()).toEqual('CRS2Course2');

			// there should NOT be admin controls for non-admins
			expect(cmp.find('.admin-controls').length).toBe(0);

			// non-admins can still click courses
			cmp.find('.course-item').first().simulate('click');

			expect(onClick).toHaveBeenCalled();

			done();
		}, 200);
	});
});
