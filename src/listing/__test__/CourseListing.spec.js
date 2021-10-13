import { render, fireEvent, waitFor } from '@testing-library/react';

import {
	setupTestClient,
	tearDownTestClient,
} from '@nti/web-client/test-utils';

import CourseListing from '../CourseListing';

const mockService = () => ({
	get: function (url) {
		if (url === 'coursesURL') {
			return Promise.resolve({
				Items: [
					{
						title: 'Course1',
						ProviderUniqueID: 'CRS1',
						getDefaultAssetRoot() {},
					},
					{
						title: 'Course2',
						ProviderUniqueID: 'CRS2',
						getDefaultAssetRoot() {},
					},
				],
			});
		}
	},
	getObject: function (objects) {
		return Promise.resolve(objects);
	},
	getCollection: function (name, subname) {
		if (name === 'AllCourses' && subname === 'Courses') {
			return {
				href: 'coursesURL',
			};
		}
	},
});

const onBefore = () => {
	setupTestClient(mockService(), 'TestUser');
};

const onAfter = () => {
	tearDownTestClient();
};

/* eslint-env jest */
describe('CourseListing test', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	test('Test admin load and display courses', async () => {
		const onClick = jest.fn();

		let cmp;
		const x = render(
			<CourseListing
				ref={_ => (cmp = _)}
				onCourseClick={onClick}
				isAdministrative
			/>
		);

		const find = s => x.container.querySelector(s);
		const findAll = s => x.container.querySelectorAll(s);

		expect(cmp.state.loading).toBe(true);
		expect(find('.loading')).toBeTruthy();

		await waitFor(() => expect(cmp.state.loading).toBe(false));

		const [a, b] = findAll('.course-meta');

		expect(a.textContent).toEqual('CRS1Course1');
		expect(b.textContent).toEqual('CRS2Course2');

		// there should be admin controls on each card
		expect(findAll('.admin-controls').length).toBe(2);

		// admins should be able to click cards
		fireEvent.click(find('.course-item'));

		expect(onClick).toHaveBeenCalled();
	});

	test('Test non-admin load and display courses', async () => {
		const onClick = jest.fn();

		let cmp;
		const x = render(
			<CourseListing ref={_ => (cmp = _)} onCourseClick={onClick} />
		);

		const find = s => x.container.querySelector(s);
		const findAll = s => x.container.querySelectorAll(s);

		expect(cmp.state.loading).toBe(true);
		expect(find('.loading')).toBeTruthy();

		await waitFor(() => expect(cmp.state.loading).toBe(false));

		const [a, b] = findAll('.course-meta');

		expect(a.textContent).toEqual('CRS1Course1');
		expect(b.textContent).toEqual('CRS2Course2');

		// there should NOT be admin controls for non-admins
		expect(findAll('.admin-controls').length).toBe(0);

		// non-admins can still click courses
		fireEvent.click(find('.course-item'));

		expect(onClick).toHaveBeenCalled();
	});
});
