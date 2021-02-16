import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import Facilitator from '../Facilitator';

import { labels } from './Role.spec';

const mockService = () => ({
	getObject: o => Promise.resolve(o),
	get: url => {
		if (url === 'badURL') {
			return Promise.reject('Bad URL');
		}

		return Promise.resolve();
	},
});

const onBefore = () => {
	global.$AppConfig = {
		...(global.$AppConfig || {}),
		username: 'TestUser',
		nodeService: mockService(),
		nodeInterface: {
			getServiceDocument: () =>
				Promise.resolve(global.$AppConfig.nodeService),
		},
	};
};

const onAfter = () => {
	//unmock getService()
	const { $AppConfig } = global;
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
	MimeType:
		'application/vnd.nextthought.courses.coursecataloginstructorlegacyinfo',
	Class: 'CourseCatalogInstructorLegacyInfo',
	username: userName,
	JobTitle: title,
	imageUrl: 'goodURL',
};

const courseInstance = {
	hasLink: () => true,
};

/* eslint-env jest */
describe('Facilitator component test', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	test('Test view', async () => {
		let cmp;
		const x = render(
			<Facilitator
				ref={_ => (cmp = _)}
				facilitator={facilitator}
				courseInstance={courseInstance}
			/>
		);

		expect(x.container.querySelector('.name').textContent).toEqual(display);
		expect(x.container.querySelector('.role')).toBeFalsy(); // view-only should not see roles
		expect(x.container.querySelector('.title').textContent).toEqual(title);

		await waitFor(() => {
			expect(cmp.state.validImage).toBe(true);

			expect(
				x.container.querySelector('.image').style.backgroundImage
			).toEqual('url(goodURL)');
		});
	});

	test('Test edit', () => {
		const onRemove = jest.fn();

		const x = render(
			<Facilitator
				facilitator={facilitator}
				courseInstance={courseInstance}
				onRemove={onRemove}
				editable
			/>
		);

		expect(x.container.querySelector('.name').textContent).toEqual(display);
		expect(x.container.querySelector('.role').textContent).toEqual(
			labels.assistant
		);
		expect(
			x.container.querySelector('.title .job-title-input').value
		).toEqual(title);

		fireEvent.click(x.container.querySelector('.delete-facilitator'));

		expect(onRemove).toHaveBeenCalledWith(facilitator);
	});

	test('Test invalid image', async () => {
		const facilitatorBadImage = {
			...facilitator,
			imageUrl: 'badURL',
		};

		let cmp;
		const x = render(
			<Facilitator
				ref={_ => (cmp = _)}
				facilitator={facilitatorBadImage}
				courseInstance={courseInstance}
			/>
		);

		expect(x.container.querySelector('.name').textContent).toEqual(display);
		expect(x.container.querySelector('.role')).toBeFalsy(); // view-only should not see roles
		expect(x.container.querySelector('.title').textContent).toEqual(title);

		await waitFor(() =>
			// verify that the image validation failed
			expect(cmp.state.validImage).toBe(false)
		);

		// update props with facilitator with valid image URL
		x.rerender(
			<Facilitator
				ref={_ => (cmp = _)}
				facilitator={facilitator}
				courseInstance={courseInstance}
			/>
		);

		await waitFor(() => {
			// verify that the image validation passed now
			expect(cmp.state.validImage).toBe(true);
		});
	});

	test('Test self user', () => {
		const myUser = {
			...facilitator,
			username: 'TestUser',
		};

		const x = render(
			<Facilitator
				facilitator={myUser}
				courseInstance={courseInstance}
				editable
			/>
		);

		expect(x.container.querySelector('.name').textContent).toEqual(display);
		expect(x.container.querySelector('.role').textContent).toEqual(
			labels.assistant
		);
		expect(
			x.container.querySelector('.title .job-title-input').value
		).toEqual(title);

		expect(x.container.querySelector('.delete-facilitator')).toBeTruthy();
	});
});
