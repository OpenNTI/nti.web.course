import EventEmitter from 'events';

import {scoped} from '@nti/lib-locale';

const t = scoped('course.navigation.tabs', {
	community: 'Community',
	activity: 'Activity',
	lessons: 'Lessons',
	scorm: 'Content',
	assignments: 'Assignments',
	discussions: 'Community',
	info: 'Course Info',
	videos: 'Videos'
});

export const getDefaultTabLabel = tab => !t.isMissing(tab) ? t(tab) : '';

export const TABS = {
	'community': {
		labelKey: 'discussions',//We are wanting to pull in any existing overrides of the discussion tab
		hasAccess: course => course.hasCommunity()
	},
	'lessons': {
		hasAccess: course => course.hasOutline() && !course.isScormInstance,
		subRoutes: ['content'],
		isRootRoute: true
	},
	'scorm': {
		hasAccess: (course) => course.isScormInstance && (course.hasLink('ImportScorm') || (course.Metadata && course.Metadata.hasLink('LaunchScorm'))),
		isRootRoute: true
	},
	'assignments': {
		hasAccess: course => course.shouldShowAssignments()
	},
	'info': {
		hasAccess: () => true
	},
	'videos': {
		hasAccess: () => true,
		notEditable: true,
		doNotShowInPreview: true
	}
};

export const DEFAULT_ORDER = ['lessons', 'scorm', 'assignments', 'community', 'info', 'videos'];

const UPDATE_BUS = new EventEmitter();

export const triggerUpdate = (course) => {
	UPDATE_BUS.emit('course-tabs-updated', course);
};

export const addUpdateListener = (fn) => {
	UPDATE_BUS.addListener('course-tabs-updated', fn);
};

export const removeUpdateListener = (fn) => {
	UPDATE_BUS.removeListener('course-tabs-updated', fn);
};
