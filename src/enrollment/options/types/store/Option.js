import Base from '../base';
import Registry from '../Registry';

function handles (option) {
	return option.MimeType === 'application/vnd.nextthought.courseware.storeenrollmentoption';
}

@Registry.register(handles)
export default class StoreEnrollmentOption extends Base {
	ORDER = 2

	async load (option) {
		if (!this.isAvailable() && !this.isEnrolled()) {
			return;
		}
	}
}