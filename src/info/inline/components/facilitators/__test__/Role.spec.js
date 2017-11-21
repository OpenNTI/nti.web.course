import React from 'react';
import { mount } from 'enzyme';

import Role from '../Role';

/* eslint-env jest */
describe('Role test', () => {
	test('Test assistant', () => {
		const onClick = jest.fn();

		const cmp = mount(<Role role="assistant" onClick={onClick}/>);

		expect(cmp.text()).toEqual('Assistant');

		cmp.simulate('click');

		expect(onClick).toHaveBeenCalled();
	});

	test('Test Editor', () => {
		const onClick = jest.fn();

		const cmp = mount(<Role role="editor" onClick={onClick}/>);

		expect(cmp.text()).toEqual('Editor');

		cmp.simulate('click');

		expect(onClick).toHaveBeenCalled();
	});

	test('Test Instructor', () => {
		const onClick = jest.fn();

		const cmp = mount(<Role role="instructor" onClick={onClick}/>);

		expect(cmp.text()).toEqual('Instructor');

		cmp.simulate('click');

		expect(onClick).toHaveBeenCalled();
	});
});
