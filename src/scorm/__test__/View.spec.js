/* eslint-env jest */
import React from 'react';
import { mount } from 'enzyme';

import View from '../View';

describe('Scorm view test', () => {
	const verifyView = (isInstructor, canImport, canLaunch, isCompletable, error) => {
		const bundle = {
			getScormCourse: () => {},
			getID: () => {},
			getLink: () => {},
			fetchLink: (rel) => {
				if(rel === 'ProgressStats') {
					return Promise.resolve({
						PercentageProgress: 0.5
					});
				}
			},
			hasLink: (rel) => {
				return canImport && rel === 'ImportScorm';
			},
			isAdministrative: isInstructor,
			Metadata: {
				hasLink: (rel) => {
					return canLaunch && rel === 'LaunchSCORM';
				},
				getLink: () => {
					return '';
				}
			},
			PreferredAccess: {
				CourseProgress: {
					getCompletedDate: () => new Date('10/22/2017')
				}
			}
		};

		if(isCompletable) {
			bundle.CompletionPolicy = {};
		}

		const onBundleUpdate = function () {};

		const cmp = mount(
			<View bundle={bundle} onBundleUpdate={onBundleUpdate} error={error}/>
		);

		expect(cmp.state().showEditor).toBe(false);

		if(isCompletable) {
			expect(cmp.find('.scorm-progress').first().exists()).toBe(true);
		}
		else {
			expect(cmp.find('.scorm-progress').first().exists()).toBe(false);
		}

		if(isInstructor) {
			expect(cmp.find('.scorm-edit-link').first().text()).toEqual('Change Content Package');
		}
		else {
			expect(cmp.find('.scorm-edit-link').first().exists()).toBe(false);
		}

		if(canLaunch && isInstructor) {
			expect(cmp.find('.scorm-export-link').first().text()).toEqual('Export Content Package');
		}
		else {
			expect(cmp.find('.scorm-export-link').first().exists()).toBe(false);
		}

		if(canLaunch) {
			expect(cmp.find('.scorm-launch-button').first().text()).toEqual('Open');
		}
		else {
			expect(cmp.find('.scorm-launch-button').first().exists()).toBe(false);
		}

		expect(cmp.find('.scorm-desc').first().text()).not.toEqual('');

		if(error) {
			expect(cmp.find('.scorm-error').first().text()).toEqual(error);
		}
		else {
			expect(cmp.find('.scorm-error').first().exists()).toBe(false);
		}

		if(isInstructor) {
			// should trigger state change
			cmp.find('.scorm-edit-link').first().simulate('click');

			expect(cmp.state().showEditor).toBe(true);
		}
	};

	test('Test instructor, importable, launchable, completable, no error', async () => {
		verifyView(true, true, true, true);
	});

	test('Test instructor, importable, launchable, completable, error', async () => {
		verifyView(true, true, true, true, 'This is an error!');
	});

	test('Test instructor, importable, launchable, non-completable, no error', async () => {
		verifyView(true, true, true, false);
	});

	test('Test instructor, non-importable, non-launchable, non-completable, no error', async () => {
		verifyView(true, true, true, false);
	});

	test('Test student, non-importable, launchable, completable, no error', async () => {
		verifyView(false, false, true, true);
	});

	test('Test student, non-importable, non-launchable, non-completable, error', async () => {
		verifyView(false, false, false, false, 'Another error!');
	});
});
