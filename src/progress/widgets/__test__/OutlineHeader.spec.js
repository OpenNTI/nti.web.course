import React from 'react';
import { mount } from 'enzyme';

import OutlineHeader from '../OutlineHeader';

const wait = n => new Promise(t => setTimeout(t, n));

/* eslint-env jest */
describe('OutlineHeader view test', () => {
	test('Test default view', async () => {
		const course = {
			NTIID: 'defaultCourse'
		};

		const cmp = mount(<OutlineHeader course={course}/>);

		expect(cmp.text()).toEqual('Outline');
	});

	test('Test incomplete student view', async () => {
		const course = {
			CompletionPolicy: {},
			PreferredAccess: {
				MimeType: 'some.type.courseinstanceenrollment',
				CourseProgress: {
					getCompletedDate () {
						return null;
					},
					AbsoluteProgress: 5,
					MaxPossibleProgress: 9,
					PercentageProgress: 0.302355
				}
			}
		};

		const cmp = mount(<OutlineHeader course={course}/>);

		expect(cmp.find('.circular-progress').first().find('.number').first().text()).toEqual('30');
		expect(cmp.find('.progress-labels').first().find('.sub-label').first().text()).toEqual('4 Items Remaining');
	});

	test('Test incomplete student view, single item remaining', async () => {
		const course = {
			CompletionPolicy: {},
			PreferredAccess: {
				MimeType: 'some.type.courseinstanceenrollment',
				CourseProgress: {
					getCompletedDate () {
						return null;
					},
					AbsoluteProgress: 5,
					MaxPossibleProgress: 6,
					PercentageProgress: 0.302355
				}
			}
		};

		const cmp = mount(<OutlineHeader course={course}/>);

		expect(cmp.find('.circular-progress').first().find('.number').first().text()).toEqual('30');
		expect(cmp.find('.progress-labels').first().find('.sub-label').first().text()).toEqual('1 Item Remaining');
	});

	test('Test complete student view, no certificate link', async () => {
		const course = {
			CompletionPolicy: {},
			PreferredAccess: {
				MimeType: 'some.type.courseinstanceenrollment',
				CourseProgress: {
					getCompletedDate () {
						return Date.now();
					},
					AbsoluteProgress: 5,
					MaxPossibleProgress: 5,
					PercentageProgress: 1.0
				},
				getLink: (rel) => {
					return null;
				}
			}
		};

		const cmp = mount(<OutlineHeader course={course}/>);

		expect(cmp.find('.circular-progress').first().find('.number').first().text()).toEqual('100');
		expect(cmp.find('.progress-labels').first().find('.sub-label').first().text()).toEqual('Completed');
	});

	test('Test complete student view with certificate link', async () => {
		const course = {
			CompletionPolicy: {},
			PreferredAccess: {
				MimeType: 'some.type.courseinstanceenrollment',
				CourseProgress: {
					getCompletedDate () {
						return Date.now();
					},
					AbsoluteProgress: 5,
					MaxPossibleProgress: 5,
					PercentageProgress: 1.0
				},
				getLink: (rel) => {
					if(rel === 'Certificate') {
						return '/some/certlink';
					}
				}
			}
		};

		const cmp = mount(<OutlineHeader course={course}/>);

		expect(cmp.find('.circular-progress').first().find('.number').first().text()).toEqual('100');

		const certAnchor = cmp.find('.progress-labels').first().find('.sub-label').first().find('a').first();

		expect(certAnchor.text()).toEqual('View Certificate');
	});

	test('Test incomplete instructor view, one student finished', async () => {
		const course = {
			CompletionPolicy: {},
			hasLink: (rel) => {
				return rel === 'ProgressStats';
			},
			fetchLink: (rel) => {
				if(rel === 'ProgressStats') {
					return {
						CountCompleted: 1,
						AbsoluteProgress: 2,
						MaxPossibleProgress: 4,
						PercentageProgress: 0.45
					};
				}
			}
		};

		const cmp = mount(<OutlineHeader course={course}/>);

		await wait(200);

		cmp.update();

		expect(cmp.find('.circular-progress').first().find('.number').first().text()).toEqual('45');
		expect(cmp.find('.progress-labels').first().find('.sub-label').first().text()).toEqual('1 Student Finished');
	});

	test('Test incomplete instructor view, two students finished', async () => {
		const course = {
			CompletionPolicy: {},
			hasLink: (rel) => {
				return rel === 'ProgressStats';
			},
			fetchLink: (rel) => {
				if(rel === 'ProgressStats') {
					return {
						CountCompleted: 2,
						AbsoluteProgress: 2,
						MaxPossibleProgress: 4,
						PercentageProgress: 0.45
					};
				}
			}
		};

		const cmp = mount(<OutlineHeader course={course}/>);

		await wait(200);

		cmp.update();

		expect(cmp.find('.circular-progress').first().find('.number').first().text()).toEqual('45');
		expect(cmp.find('.progress-labels').first().find('.sub-label').first().text()).toEqual('2 Students Finished');
	});

	test('Test incomplete instructor view, all students finished', async () => {
		const course = {
			CompletionPolicy: {},
			hasLink: (rel) => {
				return rel === 'ProgressStats';
			},
			fetchLink: (rel) => {
				if(rel === 'ProgressStats') {
					return {
						CountCompleted: 4,
						AbsoluteProgress: 4,
						MaxPossibleProgress: 4,
						PercentageProgress: 1.0
					};
				}
			}
		};

		const cmp = mount(<OutlineHeader course={course}/>);

		await wait(200);

		cmp.update();

		expect(cmp.find('.circular-progress').first().find('.number').first().text()).toEqual('100');
		expect(cmp.find('.progress-labels').first().find('.sub-label').first().text()).toEqual('4 Students Finished');
	});
});
