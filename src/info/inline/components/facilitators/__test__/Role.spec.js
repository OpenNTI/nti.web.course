import React from 'react';
import { mount } from 'enzyme';

import Role from '../Role';

export const labels = {
	'assistant': 'Grading Access',
	'editor': 'Editing Access',
	'instructor': 'Full Access',
};

/* eslint-env jest */
describe('Role test', () => {
	test('Test assistant', () => {
		const onClick = jest.fn();

		const cmp = mount(<Role role="assistant" onClick={onClick}/>);

		expect(cmp.text()).toEqual(labels.assistant);

		cmp.simulate('click');

		expect(onClick).toHaveBeenCalled();
	});

	test('Test Editor', () => {
		const onClick = jest.fn();

		const cmp = mount(<Role role="editor" onClick={onClick}/>);

		expect(cmp.text()).toEqual(labels.editor);

		cmp.simulate('click');

		expect(onClick).toHaveBeenCalled();
	});

	test('Test Instructor', () => {
		const onClick = jest.fn();

		const cmp = mount(<Role role="instructor" onClick={onClick}/>);

		expect(cmp.text()).toEqual(labels.instructor);

		cmp.simulate('click');

		expect(onClick).toHaveBeenCalled();
	});
});
