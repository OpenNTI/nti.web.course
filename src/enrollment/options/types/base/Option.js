import Description from './Description';
import DropButton from './DropButton';
import EnrollButton from './EnrollButton';
import EnrolledTitle from './EnrolledTitle';
import EnrolledDescription from './EnrolledDescription';
import ListItem from './ListItem';
import UpgradeDescription from './UpgradeDescription';

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
	UpgradeDescription = UpgradeDescription
	EnrollButton = EnrollButton
	DropButton = DropButton


	constructor (option, access, catalogEntry) {
		this.option = option;
		this.access = access;
		this.catalogEntry = catalogEntry;
	}


	isEnrolled () {
		return this.option && this.option.enrolled;
	}


	enrolledBeforeArchived () {
		const endDate = this.catalogEntry.getEndDate();
		const enrolledDate = this.access && this.access.getCreatedTime();

		return !endDate || (enrolledDate && enrolledDate < endDate);
	}


	isAvailable () {
		//If you are administrating a course no option is available;
		return this.option && (this.option.available || this.option.enrolled) && (!this.access || !this.access.isAdministrative);
	}

	shouldOverride () { return false; }


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


	getUpgradeDescription () {
		return this.getDescription();
	}
}
