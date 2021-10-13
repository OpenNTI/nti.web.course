/* eslint-env jest */
import { render, fireEvent } from '@testing-library/react';

import View from '../View';

describe('Scorm view test', () => {
	const verifyView = async (
		isInstructor,
		canImport,
		canLaunch,
		isCompletable,
		error
	) => {
		const bundle = {
			getScormCourse: () => {},
			getID: () => {},
			getLink: () => {},
			fetchLink: rel => {
				if ((rel?.rel || rel) === 'ProgressStats') {
					return Promise.resolve({
						PercentageProgress: 0.5,
					});
				}
			},
			hasLink: rel => {
				return canImport && rel === 'ImportScorm';
			},
			isAdministrative: isInstructor,
			Metadata: {
				hasLink: rel => {
					return canLaunch && rel === 'LaunchSCORM';
				},
				getLink: () => {
					return '';
				},
			},
			PreferredAccess: {
				CourseProgress: {
					getCompletedDate: () => new Date('10/22/2017'),
				},
			},
			title: '--',
		};

		if (isCompletable) {
			bundle.CompletionPolicy = {};
		}

		const onBundleUpdate = function () {};

		let cmp;
		const x = render(
			<View
				ref={_ => (cmp = _)}
				bundle={bundle}
				onBundleUpdate={onBundleUpdate}
				error={error}
			/>
		);

		const find = s => x.container.querySelector(s);

		expect(cmp.state.showEditor).toBe(false);

		if (isCompletable) {
			expect(find('.scorm-progress')).toBeTruthy();
		} else {
			expect(find('.scorm-progress')).toBeFalsy();
		}

		if (isInstructor) {
			expect(find('.scorm-edit-link').textContent).toEqual(
				'Change Content Package'
			);
		} else {
			expect(find('.scorm-edit-link')).toBeFalsy();
		}

		if (canLaunch && isInstructor) {
			expect(find('.scorm-export-link').textContent).toEqual(
				'Export Content Package'
			);
		} else {
			expect(find('.scorm-export-link')).toBeFalsy();
		}

		if (canLaunch) {
			expect(find('.scorm-launch-button').textContent).toEqual('Open');
		} else {
			expect(find('.scorm-launch-button')).toBeFalsy();
		}

		expect(find('.scorm-desc').textContent).not.toEqual('');

		if (error) {
			expect(find('.scorm-error').textContent).toEqual(error);
		} else {
			expect(find('.scorm-error')).toBeFalsy();
		}

		if (isInstructor) {
			// should trigger state change
			fireEvent.click(find('.scorm-edit-link'));

			expect(cmp.state.showEditor).toBe(true);
		}
	};

	test('Test instructor, importable, launchable, completable, no error', async () =>
		verifyView(true, true, true, true));

	test('Test instructor, importable, launchable, completable, error', async () =>
		verifyView(true, true, true, true, 'This is an error!'));

	test('Test instructor, importable, launchable, non-completable, no error', async () =>
		verifyView(true, true, true, false));

	test('Test instructor, non-importable, non-launchable, non-completable, no error', async () =>
		verifyView(true, true, true, false));

	test('Test student, non-importable, launchable, completable, no error', async () =>
		verifyView(false, false, true, true));

	test('Test student, non-importable, non-launchable, non-completable, error', async () =>
		verifyView(false, false, false, false, 'Another error!'));
});
