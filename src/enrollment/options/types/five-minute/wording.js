import {scoped} from '@nti/lib-locale';

export default scoped('course.enrollment.types.five-minute', {
	enrolled: {
		title: {
			active: 'Enrolled for College Credit',
			archived: 'Enrolled for College Credit'
		},
		description: {
			active: {
				startDate: 'Class begins %(fullStartDate)s and will be conducted fully online.',
				noStartDate: 'Class will be conducted fully online.'
			},
			archived: 'Thanks for your particpation! The content of this course will remain available for you to review at any time.'
		}
	}
});
