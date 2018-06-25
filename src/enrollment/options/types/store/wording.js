import {scoped} from '@nti/lib-locale';

export default scoped('course.enrollment.types.store', {
	enrolled: {
		title: {
			active: 'You\'re Enrolled',
			archived: 'You took the Course'
		},
		description: {
			active: {
				startDate: 'Your access to exam preparation materials begins %(fullStartDate)s.',
				noStartDate: 'Your access to exam preparation materials begins now.'
			},
			archived: 'Thanks for your participation! The content of this course will remain available for you to review at any time.'
		}
	}
});
