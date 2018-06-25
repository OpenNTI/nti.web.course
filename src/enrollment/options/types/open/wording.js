import {scoped} from '@nti/lib-locale';

export default scoped('course.enrollment.types.open', {
	enrolled: {
		title: {
			active: 'Enrolled in the open course',
			archived: 'Enrolled in the archived course'
		},
		description: {
			active: {
				startDate: 'Class begins %(startDate)s and will be conducted fully online.',
				noStartDate: 'Class will be conducted fully online.'
			},
			archived: 'Thanks for your participation! The content of this course will remain available for you to review at any time.'
		}
	}
});
