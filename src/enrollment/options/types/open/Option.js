import {scoped} from '@nti/lib-locale';

import Base from '../base';
import Registry from '../Registry';

const t = scoped('course.enrollment.types.open', {
	enrolled: {
		title: {
			'notArchived': 'Basic',
			'archived': 'Archived'
		},
		description: {
			'notArchived-startDate': 'Class begins %(fullStartDate)s and will be conducted fully online.',
			'notArchived-noStartDate': 'Class will be conducted fully online.',
			'archived-endDate': 'The course ended on %(fullEndDate)s. The content of this course will remain available for you to review at any time.',
			'archived-noEndDate': 'The content of this course will remain available for you to review at any time'
		},
		dropLabel: 'Remove',
		openLabel: 'Open'
	},
	notEnrolled:  {
		title: {
			'notArchived': 'Basic',
			'archived': 'Archived'
		},
		description: 'Interact with content and connect with a community of learners.',
		buttonLabel: 'Get for Free'
	}
});


function handles (option) {
	return option.MimeType === 'application/vnd.nextthought.courseware.openenrollmentoption';
}

@Registry.register(handles)
export default class OpenEnrollmentOption extends Base {
	ORDER = 1

	getString = t

	async load () {
		if (!this.isAvailable() && !this.isEnrolled()) {
			return;
		}
	}
}
