import React from 'react';
import { render } from '@testing-library/react';

import CourseVideo from '../CourseVideo';

/* eslint-env jest */
describe('CourseVideo test', () => {
	const catalogEntry = {};

	test('Test no video - view only', () => {
		const x = render(<CourseVideo catalogEntry={catalogEntry}/>);

		expect(x.container.innerHTML).toBe('');
	});

	test('Test no video - editable', () => {
		const x = render(<CourseVideo catalogEntry={catalogEntry} editable/>);

		expect(x.container.querySelector('.video-button').textContent).toMatch(/Cover Video/);

		expect(x.container.querySelector('.buttons')).toBeFalsy();
	});

	test('Test no video - editable', () => {
		const catalogEntryWithVideo = {
			Video: {
				source: ['http://youtube.com/fakevideo']
			}
		};

		const x = render(<CourseVideo catalogEntry={catalogEntryWithVideo} editable/>);

		expect(x.container.querySelector('.video-button')).toBeFalsy();

		const buttons = x.container.querySelector('.buttons');

		expect(buttons.querySelector('.change')).toBeTruthy();
		expect(buttons.querySelector('.remove')).toBeTruthy();
	});
});
