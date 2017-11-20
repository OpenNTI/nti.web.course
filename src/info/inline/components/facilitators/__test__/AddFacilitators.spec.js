import React from 'react';
import { mount } from 'enzyme';

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
	test('Test view', () => {
		const onDismiss = jest.fn();
		const existing = [];

		const cmp = mount(<AddFacilitators courseInstance={courseInstance} onDismiss={onDismiss} facilitatorList={existing}/>);

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

		expect(cmp.state().isVisible).toBe(false);

		cmp.find('input[type="checkbox"]').first().simulate('change', { target: { checked: true } });

		expect(cmp.state().isVisible).toBe(true);

		cmp.find('.confirm').first().simulate('click');

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
