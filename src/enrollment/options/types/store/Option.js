import Base from '../base';
import Registry from '../Registry';

import EnrolledTitle from './EnrolledTitle';
import EnrolledDescription from './EnrolledDescription';

function handles (option) {
	return option.MimeType === 'application/vnd.nextthought.courseware.storeenrollmentoption';
}

@Registry.register(handles)
export default class StoreEnrollmentOption extends Base {
	ORDER = 2

	EnrolledTitle = EnrolledTitle
	EnrolledDescription = EnrolledDescription

	async load (option) {
		if (!this.isAvailable() && !this.isEnrolled()) {
			return;
		}
	}
}
