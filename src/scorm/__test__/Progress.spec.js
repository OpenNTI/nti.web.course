/* eslint-env jest */
import { render } from '@testing-library/react';

import { wait } from '@nti/lib-commons';

import Progress from '../Progress';

describe('Scorm progress view test', () => {
	const verifyView = async (isInstructor, completed, passed) => {
		const bundle = {
			getScormCourse: () => {},
			getID: () => {},
			getLink: () => {},
			fetchLink: rel => {
				if (isInstructor && (rel?.rel || rel) === 'ProgressStats') {
					return Promise.resolve({
						PercentageProgress: 0.5,
					});
				}

				return Promise.reject();
			},
			isAdministrative: isInstructor,
			title: '--',
		};

		if (!isInstructor) {
			bundle.PreferredAccess = {
				CourseProgress: {
					getCompletedDate: () => {
						return '';
					},
					CompletedItem: {
						Success: completed ? passed : null,
					},
				},
			};
		}

		const onBundleUpdate = function () {};

		const x = render(
			<Progress
				bundle={bundle}
				onBundleUpdate={onBundleUpdate}
				isAdmin={isInstructor}
			/>
		);

		// wait a bit for async functions to 'load' data
		await wait();

		if (isInstructor) {
			expect(
				x.container.querySelector('.circular-progress .number')
					.textContent
			).toEqual('50');
		} else {
			if (completed) {
				const status = x.container.querySelector('.completion-status');

				if (passed) {
					expect(status.querySelector('.title').textContent).toEqual(
						'Passed'
					);
					expect(
						status.querySelector('.message').textContent
					).toEqual(
						'Congratulations, you earned a satisfactory score.'
					);
				} else {
					expect(status.querySelector('.title').textContent).toEqual(
						'Bummer..'
					);
					expect(
						status.querySelector('.message').textContent
					).toEqual(
						'Unfortunately, you did not earn a satisfactory score.'
					);
				}
			} else {
				const status = x.container.querySelector('.not-completed');

				expect(status.querySelector('.title').textContent).toEqual(
					'No Data Yet'
				);
				expect(status.querySelector('.message').textContent).toEqual(
					'Data about your course will appear here.'
				);
			}
		}
	};

	test('Test instructor', async () => verifyView(true, false, false));

	test('Test student, completed, passed', async () =>
		verifyView(false, true, true));

	test('Test student, completed, failed', async () =>
		verifyView(false, true, false));

	test('Test student, not completed', async () =>
		verifyView(false, false, false));
});
