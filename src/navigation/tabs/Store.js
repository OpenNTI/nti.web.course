import path from 'path';

import {Stores} from '@nti/lib-store';
import {scoped} from '@nti/lib-locale';
import {isFlag, getService} from '@nti/web-client';

const t = scoped('course.navigation.tabs', {
	activity: 'Activity',
	lessons: 'Lessons',
	scorm: 'Content',
	assignments: 'Assignments',
	discussions: 'Discussions',
	courseInfo: 'Course Info'
});


const DEFAULT_ORDER = ['activity', 'lessons', 'scorm', 'assignments', 'discussions', 'info'];
const TABS = {
	'activity': {
		shouldShow: course => isFlag('course-activity') && course.hasOutline() && !course.CatalogEntry.Preview
	},
	'lessons': {
		shouldShow: course => course.hasOutline(),
		isRootRoute: true
	},
	'scorm': {
		shouldShow: course => course.isScormInstance,
		isRootRoute: true
	},
	'assignments': {
		shouldShow: course => course.shouldShowAssignments()
	},
	'discussions': {
		shouldShow: course => course.hasDiscussions()
	},
	'info': {
		shouldShow: () => true
	}
};

function formatTabs (course, overrides = {}) {
	const order = overrides.order || DEFAULT_ORDER;
	const labels = overrides.labels || {};

	return order
		.filter(key => TABS[key] && TABS[key].shouldShow(course))
		.map((key) => {
			return {
				id: key,
				label: labels[key] != null ? labels[key] : t(key),
				isRootRoute: TABS[key] && TABS[key].isRootRoute
			};
		});
}

export default class CourseTabStore extends Stores.BoundStore {
	async load () {
		if (!this.binding) { return; }

		try {
			const service = await getService();
			const href = this.binding.href;
			const vendorInfo = await service.get(path.join(href, 'vendor-info'));

			this.set({
				tabs: formatTabs(this.binding, vendorInfo['course-tabs'])
			});
		} catch (e) {
			this.set({
				tabs: formatTabs(this.binding)
			});
		}
	}
}
