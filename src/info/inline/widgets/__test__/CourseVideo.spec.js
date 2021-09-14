import React from 'react';
import { render } from '@testing-library/react';

import CourseVideo from '../CourseVideo';

/* eslint-env jest */
describe('CourseVideo test', () => {
	const catalogEntry = {};

	test('Test no video - view only', () => {
		const x = render(<CourseVideo catalogEntry={catalogEntry} />);

		expect(x.container.innerHTML).toBe('');
	});

	test('Test no video - editable', () => {
		const x = render(<CourseVideo catalogEntry={catalogEntry} editable />);

		expect(x.getByTestId('set-course-video').textContent).toMatch(
			/Cover Video/
		);

		expect(x.queryByTestId('change')).toBeFalsy();
		expect(x.queryByTestId('remove')).toBeFalsy();
	});

	test('Test no video - editable', () => {
		const catalogEntryWithVideo = {
			Video: {
				source: ['http://youtube.com/fakevideo'],
			},
		};

		const x = render(
			<CourseVideo catalogEntry={catalogEntryWithVideo} editable />
		);

		expect(x.queryByTestId('set-course-video')).toBeFalsy();

		expect(x.getByTestId('change')).toBeTruthy();
		expect(x.getByTestId('remove')).toBeTruthy();
	});
});
