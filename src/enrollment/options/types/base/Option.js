import EnrolledTitle from './EnrolledTitle';
import EnrolledDescription from './EnrolledDescription';

export default class BaseEnrollment {
	static async load (option, access) {
		const Cls = this;
		const enrollmentOption = new Cls(option, access);

		await enrollmentOption.load();

		return enrollmentOption;
	}

	ORDER = 100

	EnrolledTitle = EnrolledTitle
	EnrolledDescription = EnrolledDescription

	constructor (option, access) {
		this.option = option;
		this.access = access;
	}


	isEnrolled () {
		return this.option && this.option.isEnrolled;
	}


	isAvailable() {
		//If you are administrating a course no option is available;
		return this.option && this.option.isAvailable && (!this.access || !this.access.isAdministrative);
	}


	getPrice () {
		return this.option.Price || null;
	}
}