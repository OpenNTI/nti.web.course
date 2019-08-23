/* eslint-env jest */
import {TABS} from '../Constants';

describe('Course Navigation Constants', () => {
	describe('TABS', () => {
		describe('access', () => {
			describe('lessons', () => {
				test('Non-scorm course, has Outline', () => {
					expect(TABS.lessons.hasAccess({isScormInstance: false, hasOutline: () => true})).toBeTruthy();
				});

				test('Non-scorm course, no outline', () => {
					expect(TABS.lessons.hasAccess({isScormInstance: false, hasOutline: () => false})).toBeFalsy();
				});

				test('Scorm course', () => {
					const course = {
						isScormInstance: true,
						hasOutline: () => true,
						hasLink: () => false
					};

					expect(TABS.lessons.hasAccess(course)).toBeFalsy();
				});
			});

			describe('scorm', () => {
				test('non-scorm course', () => {
					expect(TABS.scorm.hasAccess({isScormInstance: false})).toBeFalsy();
				});

				test('scorm course, no import or launch link', () => {
					const course =  {
						isScormInstance: true,
						hasLink: () => false,
						Metadata: {
							hasLink: () => false
						}
					};

					expect(TABS.scorm.hasAccess(course)).toBeFalsy();
				});

				test('scorm course, with import link', () => {
					const course = {
						isScormInstance: true,
						hasLink: rel => rel === 'ImportScorm'
					};

					expect(TABS.scorm.hasAccess(course)).toBeTruthy();
				});

				test('scorm course, with launch link', () => {
					const course = {
						isScormInstance: true,
						hasLink: () => false,
						Metadata: {
							hasLink: rel => rel === 'LaunchScorm'
						}
					};

					expect(TABS.scorm.hasAccess(course)).toBeTruthy();
				});
			});

			describe('assignments', () => {
				test('course has assignments', () => {
					expect(TABS.assignments.hasAccess({shouldShowAssignments: () => true})).toBeTruthy();
				});

				test('course does not have assignments', () => {
					expect(TABS.assignments.hasAccess({shouldShowAssignments: () => false})).toBeFalsy();
				});
			});

			test('info', () => {
				expect(TABS.info.hasAccess()).toBeTruthy();
			});

			test('videos', () => {
				expect(TABS.videos.hasAccess()).toBeTruthy();
			});
		});
	});
});
