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

/* eslint-env jest */
describe('AddFacilitators component test', () => {
	test('Test view', () => {
		let addedValue = {
			role: 'none',
			visible: false
		};

		const onConfirm = (values) => {
			addedValue.role = values[0].role;
			addedValue.visible = values[0].visible;
			addedValue.username = values[0].username;
		};
		const onDismiss = jest.fn();

		const cmp = mount(<AddFacilitators onDismiss={onDismiss} onConfirm={onConfirm}/>);

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

		expect(addedValue.role).toEqual('instructor');
		expect(addedValue.visible).toEqual(true);
		expect(addedValue.username).toEqual(userName);
	});
});


function TestCmp () {
	return (
		<div className="test-cmp">
			Test Content
		</div>
	);
}
