import React from 'react';
import { mount } from 'enzyme';

import CourseVideo from '../CourseVideo';

/* eslint-env jest */
describe('CourseVideo test', () => {
	const catalogEntry = {};

	test('Test no video - view only', () => {
		const cmp = mount(<CourseVideo catalogEntry={catalogEntry}/>);

		expect(cmp.html()).toBe(null);
	});

	test('Test no video - editable', () => {
		const cmp = mount(<CourseVideo catalogEntry={catalogEntry} editable/>);

		expect(cmp.find('.video-button').first().text()).toMatch(/Cover Video/);

		const buttons = cmp.find('.buttons').first();

		expect(buttons.exists()).toBe(false);
	});

	test('Test no video - editable', () => {
		const catalogEntryWithVideo = {
			Video: {
				source: ['http://youtube.com/fakevideo']
			}
		};

		const cmp = mount(<CourseVideo catalogEntry={catalogEntryWithVideo} editable/>);

		expect(cmp.find('.video-button').first().exists()).toBe(false);

		const buttons = cmp.find('.buttons').first();

		expect(buttons.exists()).toBe(true);
		expect(buttons.find('.change').first().exists()).toBe(true);
		expect(buttons.find('.remove').first().exists()).toBe(true);
	});
});
