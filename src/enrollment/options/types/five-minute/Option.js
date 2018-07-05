import {scoped} from '@nti/lib-locale';

import Base from '../base';
import Registry from '../Registry';

const t = scoped('course.enrollment.types.five-minute', {
	enrolled: {
		title: 'Enrolled for College Credit',
		description: {
			'archived': 'Thanks for your participation! The content of this course will remain available for you to review at any time.',
			'notArchived-startDate': 'Class begins %(fullStartDate)s and will be conducted fully online.',
			'notAcrhived-noStartDate': 'Class will be conducted fully online.'
		},
		buttonLabel: ''
	},
	notEnrolled: {
		title: 'Earn College Credit',
		description: 'Earn transcripted college credit.',
		buttonLabel: 'Earn College Credit'
	}
});


function handles (option) {
	return option.MimeType === 'application/vnd.nextthought.courseware.fiveminuteenrollmentoption';
}

@Registry.register(handles)
export default class FiveMinuteEnrollmentOption extends Base {
	ORDER = 3

	getString = t


	getPrice () {
		return this.option.OU_Price;
	}

	async load () {
		if (!this.isAvailable() && !this.isEnrolled()) {
			return;
		}
	}
}
