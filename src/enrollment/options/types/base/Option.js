import Description from './Description';
import EnrollButton from './EnrollButton';
import EnrolledTitle from './EnrolledTitle';
import EnrolledDescription from './EnrolledDescription';
import ListItem from './ListItem';

export default class BaseEnrollment {
	static async load (option, access, catalogEntry) {
		const Cls = this;
		const enrollmentOption = new Cls(option, access, catalogEntry);

		await enrollmentOption.load();

		return enrollmentOption;
	}

	ORDER = 100

	EnrolledTitle = EnrolledTitle
	EnrolledDescription = EnrolledDescription
	ListItem = ListItem
	Description = Description
	EnrollButton = EnrollButton

	constructor (option, access, catalogEntry) {
		this.option = option;
		this.access = access;
		this.catalogEntry = catalogEntry;
	}


	isEnrolled () {
		return this.option && this.option.enrolled;
	}


	isAvailable() {
		//If you are administrating a course no option is available;
		return this.option && (this.option.available || this.option.enrolled) && (!this.access || !this.access.isAdministrative);
	}


	getPrice () {
		return this.option.Price || null;
	}


	getTitle () {
		return `!! Missing Title for ${this.option.class} !!`;
	}


	getDescription () {
		return ` !! Missing Description for ${this.option.class} !!`;
	}


	getEnrolledTitle () {
		return `!! Missing Enrolled Title for ${this.option.class} !!`;
	}


	getEnrolledDescription () {
		return `!! Missing Enrolled Description for ${this.option.class} !!`;
	}
}
