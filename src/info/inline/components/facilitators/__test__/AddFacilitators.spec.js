import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { wait } from '@nti/lib-commons';

import AddFacilitators from '../AddFacilitators';

const display = 'User 1234';
const userName = 'user1234';
const title = 'Professor of bird law';

const facilitator = {
	visible: true,
	role: 'facilitator',
	alias: display,
	Username: userName,
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
describe('AddFacilitators component test', () => {
	test('Test view', async () => {
		const onDismiss = jest.fn();
		const existing = [];

		let cmp;
		const x = render(<AddFacilitators ref={_ => cmp = _} courseInstance={courseInstance} onDismiss={onDismiss} facilitatorList={existing}/>);

		cmp.setState({
			values: [
				{
					display,
					key: userName,
					value: facilitator,
					view: TestCmp
				}
			],
			selectedRole: 'instructor'
		});


		await waitFor(() => expect(cmp.state.isVisible).toBe(false));

		fireEvent.click(x.container.querySelector('input[type="checkbox"]'), { target: { checked: false } });

		await waitFor(() => expect(cmp.state.isVisible).toBe(true));

		fireEvent.click(x.container.querySelector('.confirm'));

		// expect(addedValue.role).toEqual('instructor');
		// expect(addedValue.visible).toEqual(true);
		// expect(addedValue.username).toEqual(userName);
	});
});


function TestCmp () {
	return (
		<div className="test-cmp">
			Test Content
		</div>
	);
}
