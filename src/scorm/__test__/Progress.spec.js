/* eslint-env jest */
import React from 'react';
import { mount } from 'enzyme';

import Progress from '../Progress';

describe('Scorm view test', () => {
	const verifyView = (isInstructor, completed, passed, done) => {
		const bundle = {
			getScormCourse: () => {},
			getID: () => {},
			getLink: () => {},
			fetchLink: (rel) => {
				if(isInstructor && rel === 'ProgressStats') {
					return Promise.resolve({
						PercentageProgress: 0.5
					});
				}

				return Promise.reject();
			},
			isAdministrative: isInstructor
		};

		if(!isInstructor) {
			bundle.PreferredAccess = {
				CourseProgress: {
					getCompletedDate: () => {
						return '';
					},
					CompletedItem: {
						Success: completed ? passed : null
					}
				}
			};
		}

		const onBundleUpdate = function () {};

		const cmp = mount(
			<Progress bundle={bundle} onBundleUpdate={onBundleUpdate} isAdmin={isInstructor}/>
		);

		// wait a bit for async functions to 'load' data
		setTimeout(() => {
			cmp.update();

			if(isInstructor) {
				const progressChart = cmp.find('.circular-progress').first();

				expect(progressChart.find('.number').first().text()).toEqual('50');
			}
			else {
				if(completed) {
					const status = cmp.find('.completion-status').first();

					if(passed) {
						expect(status.find('.title').first().text()).toEqual('Passed');
						expect(status.find('.message').first().text()).toEqual('Congratulations, you earned a satisfactory score.');
					}
					else {
						expect(status.find('.title').first().text()).toEqual('Bummer..');
						expect(status.find('.message').first().text()).toEqual('Unfortunately, you did not earn a satisfactory score.');
					}
				}
				else {
					const status = cmp.find('.not-completed').first();

					expect(status.find('.title').first().text()).toEqual('No Data Yet');
					expect(status.find('.message').first().text()).toEqual('Data about your course will appear here.');
				}
			}

			done();
		}, 500);
	};

	test('Test instructor', async (done) => {
		verifyView(true, false, false, done);
	});

	test('Test student, completed, passed', async (done) => {
		verifyView(false, true, true, done);
	});

	test('Test student, completed, failed', async (done) => {
		verifyView(false, true, false, done);
	});

	test('Test student, not completed', async (done) => {
		verifyView(false, false, false, done);
	});
});
