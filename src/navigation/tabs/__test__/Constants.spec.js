/* eslint-env jest */
import {TABS} from '../Constants';

describe('Course Navigation Constants', () => {
	describe('TABS', () => {
		describe('access', () => {
			describe('activity', () => {
				test('Course has an outline', () => {
					expect(TABS.activity.hasAccess({hasOutline: () => true})).toBeTruthy();
				});

				test('Course does not have an outline', () => {
					expect(TABS.activity.hasAccess({hasOutline: () => false})).toBeFalsy();
				});
			});

			describe('lessons', () => {
				test('Non-scorm course, has Outline', () => {
					expect(TABS.lessons.hasAccess({isScormInstance: false, hasOutline: () => true})).toBeTruthy();
				});

				test('Non-scorm course, no outline', () => {
					expect(TABS.lessons.hasAccess({isScormInstance: false, hasOutline: () => false})).toBeFalsy();
				});

				test('Scorm course', () => {
					expect(TABS.lessons.hasAccess({isScormInstance: true, hasOutline: () => true})).toBeFalsy();
				});
			});

			describe('scorm', () => {
				test('non-scorm course', () => {
					expect(TABS.scorm.hasAccess({isScormInstance: false})).toBeFalsy();
				});

				test('scorm course', () => {
					expect(TABS.scorm.hasAccess({isScormInstance: true})).toBeTruthy();
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

			describe('discussions', () => {
				test('course has discussions', () => {
					expect(TABS.discussions.hasAccess({hasDiscussions: () => true})).toBeTruthy();
				});

				test('course does not have discussions', () => {
					expect(TABS.discussions.hasAccess({hasDiscussions: () => true})).toBeTruthy();
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
