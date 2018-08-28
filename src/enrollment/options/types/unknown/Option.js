import {scoped} from '@nti/lib-locale';

import Base from '../base';

const t = scoped('course.enrollment.types.unknown', {
	enrolled: {
		title: 'Joined',
		description: {
			'notArchived-startDate': 'Class begins %(fullStartDate)s and will be conducted fully online.',
			'notArchived-noStartDate': 'Class will be conducted fully online.',
			'archived-endDate': 'The course ended on %(fullEndDate)s. The content of this course will remain available for you to review at any time.',
			'archived-noEndDate': 'The content of this course will remain available for you to review at any time'
		},
		openLabel: 'Open'
	}
});

export default class UnknownEnrollment extends Base {
	ORDER = 1

	getString = t

	load () {}

	isEnrolled () {
		return true;
	}

	isAvailable () {
		return true;
	}

	getPrice () {
		return null;
	}

	getDropButtonLabel () {
		return '';
	}
}
