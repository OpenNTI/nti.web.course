import {scoped} from '@nti/lib-locale';

import Base from '../base';
import Registry from '../Registry';

const t = scoped('course.enrollment.types.ensync-imis', {
	enrolled: {
		title: 'IMIS',
		description: {
			'notArchived-startDate': 'Class begins %(fullStartDate)s and will be conducted fully online.',
			'notArchived-noStartDate': 'Class will be conducted fully online.',
			'archived-endDate': 'The course ended on %(fullEndDate)s. The content of this course will remain available for you to review at any time.',
			'archived-noEndDate': 'The content of this course will remain available for you to review at any time'
		},
		dropLabel: '',
		openLabel: 'Open'
	},
	notEnrolled: {
		title: 'IMIS',
		description: 'Interact with content and connect with a community of learners.',
		buttonLabel: 'Sign Up'
	}
});

function handles (option) {
	return option.MimeType === 'application/vnd.nextthought.courseware.ensyncimisexternalenrollmentoption';
}

@Registry.register(handles)
export default class ExternalEnrollmentOption extends Base {
	ORDER = 2

	getString = t

	async load () {
		if (!this.isAvailable() && !this.isEnrolled()) {
			return;
		}
	}
}
