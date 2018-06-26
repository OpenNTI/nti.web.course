import EnrolledTitle from './EnrolledTitle';
import EnrolledDescription from './EnrolledDescription';
import ListItem from './ListItem';

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
	ListItem = ListItem

	constructor (option, access) {
		this.option = option;
		this.access = access;
	}


	isEnrolled () {
		return this.option && this.option.enrolled;
	}


	isAvailable() {
		//If you are administrating a course no option is available;
		return this.option && this.option.available && (!this.access || !this.access.isAdministrative);
	}


	getPrice () {
		return this.option.Price || null;
	}


	getEnrolledTitle () {
		return `!! Missing Enrolled Title for ${this.option.class} !!`;
	}


	getEnrolledDescription () {
		return `!! Missing Enrolled Description for ${this.option.class} !!`;
	}
}