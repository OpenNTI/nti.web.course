import Base from '../base';
import Registry from '../Registry';

import EnrolledTitle from './EnrolledTitle';
import EnrolledDescription from './EnrolledDescription';

function handles (option) {
	return option.MimeType === 'application/vnd.nextthought.courseware.openenrollmentoption';
}

@Registry.register(handles)
export default class OpenEnrollmentOption extends Base {
	ORDER = 1

	EnrolledTitle = EnrolledTitle
	EnrolledDescription = EnrolledDescription

	async load () {
		if (!this.isAvailable() && !this.isEnrolled()) {
			return;
		}
	}
}
