import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { Models } from '@nti/lib-interfaces';

import OutlineHeader from '../OutlineHeader';

/* eslint-env jest */
describe('OutlineHeader view test', () => {
	test('Test default view', async () => {
		const course = {
			NTIID: 'defaultCourse',
		};

		const x = render(<OutlineHeader course={course} />);

		expect(x.container.textContent).toEqual('Outline');
	});

	test('Test incomplete student view', async () => {
		const course = {
			CompletionPolicy: {},
			PreferredAccess: {
				addListener() {},
				MimeType: 'some.type.courseinstanceenrollment',
				CourseProgress: new Models.courses.CourseProgress(null, null, {
					AbsoluteProgress: 5,
					MaxPossibleProgress: 9,
					PercentageProgress: 0.302355,
				}),
			},
		};

		const { container: root } = render(<OutlineHeader course={course} />);

		expect(
			root.querySelector('.circular-progress .number').textContent
		).toEqual('30');
		expect(
			root.querySelector('.progress-labels .sub-label').textContent
		).toEqual('4 Items Remaining');
	});

	test('Test incomplete student view, single item remaining', async () => {
		const course = {
			CompletionPolicy: {},
			PreferredAccess: {
				addListener() {},
				MimeType: 'some.type.courseinstanceenrollment',
				CourseProgress: new Models.courses.CourseProgress(null, null, {
					AbsoluteProgress: 5,
					MaxPossibleProgress: 6,
					PercentageProgress: 0.302355,
				}),
			},
		};

		const { container: root } = render(<OutlineHeader course={course} />);

		expect(
			root.querySelector('.circular-progress .number').textContent
		).toEqual('30');
		expect(
			root.querySelector('.progress-labels .sub-label').textContent
		).toEqual('1 Item Remaining');
	});

	test('Test complete student view, no certificate link', async () => {
		const course = {
			CompletionPolicy: {},
			PreferredAccess: {
				addListener() {},
				MimeType: 'some.type.courseinstanceenrollment',
				CourseProgress: new Models.courses.CourseProgress(null, null, {
					CompletedDate: Date.now() / 1000,
					CompletedItem: {
						MimeType: Models.courses.CompletedItem.MimeType,
						CompletedDate: Date.now() / 1000,
					},
					AbsoluteProgress: 5,
					MaxPossibleProgress: 5,
					PercentageProgress: 1.0,
				}),
				getLink: rel => {
					return null;
				},
			},
		};

		const { container: root } = render(<OutlineHeader course={course} />);

		expect(
			root.querySelector('.circular-progress .number').textContent
		).toEqual('100');
		expect(
			root.querySelector('.progress-labels .sub-label').textContent
		).toEqual('Completed');
	});

	test('Test complete student view with certificate link', async () => {
		const course = {
			CompletionPolicy: {},
			PreferredAccess: {
				addListener() {},
				MimeType: 'some.type.courseinstanceenrollment',
				CourseProgress: new Models.courses.CourseProgress(null, null, {
					CompletedDate: Date.now() / 1000,
					CompletedItem: {
						MimeType: Models.courses.CompletedItem.MimeType,
						CompletedDate: Date.now() / 1000,
					},
					AbsoluteProgress: 5,
					MaxPossibleProgress: 5,
					PercentageProgress: 1.0,
				}),
				getLink: rel => {
					if (rel === 'Certificate') {
						return '/some/certlink';
					}
				},
			},
		};

		const { container: root } = render(<OutlineHeader course={course} />);

		expect(
			root.querySelector('.circular-progress .number').textContent
		).toEqual('100');
		expect(
			root.querySelector('.progress-labels .sub-label a').textContent
		).toEqual('View Certificate');
	});

	test('Test incomplete instructor view, one student finished', async () => {
		const course = {
			CompletionPolicy: {},
			hasLink: rel => {
				return rel === 'ProgressStats';
			},
			fetchLink: rel => {
				if ((rel?.rel || rel) === 'ProgressStats') {
					return new Models.courses.CourseProgress(null, null, {
						CountCompleted: 1,
						AbsoluteProgress: 2,
						MaxPossibleProgress: 4,
						PercentageProgress: 0.45,
					});
				}
			},
		};

		const { container: root } = render(<OutlineHeader course={course} />);

		await waitFor(() => {
			expect(
				root.querySelector('.circular-progress .number').textContent
			).toEqual('45');
			expect(
				root.querySelector('.progress-labels .sub-label').textContent
			).toEqual('1 Student Finished');
		});
	});

	test('Test incomplete instructor view, two students finished', async () => {
		const course = {
			CompletionPolicy: {},
			hasLink: rel => {
				return rel === 'ProgressStats';
			},
			fetchLink: rel => {
				if ((rel?.rel || rel) === 'ProgressStats') {
					return new Models.courses.CourseProgress(null, null, {
						CountCompleted: 2,
						AbsoluteProgress: 2,
						MaxPossibleProgress: 4,
						PercentageProgress: 0.45,
					});
				}
			},
		};

		const { container: root } = render(<OutlineHeader course={course} />);

		await waitFor(() => {
			expect(
				root.querySelector('.circular-progress .number').textContent
			).toEqual('45');
			expect(
				root.querySelector('.progress-labels .sub-label').textContent
			).toEqual('2 Students Finished');
		});
	});

	test('Test incomplete instructor view, all students finished', async () => {
		const course = {
			CompletionPolicy: {},
			hasLink: rel => {
				return rel === 'ProgressStats';
			},
			fetchLink: rel => {
				if ((rel?.rel || rel) === 'ProgressStats') {
					return new Models.courses.CourseProgress(null, null, {
						CountCompleted: 4,
						AbsoluteProgress: 4,
						MaxPossibleProgress: 4,
						PercentageProgress: 1.0,
					});
				}
			},
		};

		const { container: root } = render(<OutlineHeader course={course} />);

		await waitFor(() => {
			expect(
				root.querySelector('.circular-progress .number').textContent
			).toEqual('100');
			expect(
				root.querySelector('.progress-labels .sub-label').textContent
			).toEqual('4 Students Finished');
		});
	});
});
