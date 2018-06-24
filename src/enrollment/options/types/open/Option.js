import Base from '../base';
import Registry from '../Registry';

function handles (option) {
	return option.MimeType === 'application/vnd.nextthought.courseware.openenrollmentoption';
}

@Registry.register(handles)
export default class OpenEnrollmentOption extends Base {
	ORDER = 1

	async load () {
		if (!this.isAvailable() && !this.isEnrolled()) {
			return;
		}
	}
}