import Base from '../base';
import Registry from '../Registry';

import EnrolledTitle from './EnrolledTitle';
import EnrolledDescription from './EnrolledDescription';

function handles (option) {
	return option.MimeType === 'application/vnd.nextthought.courseware.fiveminuteenrollmentoption';
}

@Registry.register(handles)
export default class FiveMinuteEnrollmentOption extends Base {
	ORDER = 3

	EnrolledTitle = EnrolledTitle
	EnrolledDescription = EnrolledDescription

	getPrice () {
		return this.option.OU_PRICE;
	}

	async load () {
		if (!this.isAvailable() && !this.isEnrolled()) {
			return;
		}
	}
}
