import {getTranslationFor} from '../../utils';

import Description from './Description';
import DropButton from './DropButton';
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
		if (!this.getString) {
			return `!! Missing Title for ${this.option.Class} !!`;
		}

		//TODO: Check the option for the title

		return getTranslationFor(this.getString, 'notEnrolled.title', this.catalogEntry, this.option, this.access);
	}


	getDescription () {
		if (!this.getString) {
			return `!! Missing Description for ${this.option.Class} !!`;
		}

		//TODO: Check the option for the description

		return getTranslationFor(this.getString, 'notEnrolled.description', this.catalogEntry, this.option, this.access);
	}


	getEnrollButtonLabel () {
		if (!this.getString) {
			return `!! Missing Enroll Button Label for ${this.option.Class} !!`;
		}

		//TODO: Check the option for the button label

		return getTranslationFor(this.getString, 'notEnrolled.buttonLabel', this.catalogEntry, this.option, this.access);
	}


	getEnrolledTitle () {
		if (!this.getString) {
			return `!! Missing Enrolled Title for ${this.option.Class} !!`;
		}

		//TODO: Check the option for the title

		return getTranslationFor(this.getString, 'enrolled.title', this.catalogEntry, this.option, this.access);
	}


	getEnrolledDescription () {
		if (!this.getString) {
			return `!! Missing Enrolled Description for ${this.option.Class} !!`;
		}

		//TODO: Check the option for the description

		return getTranslationFor(this.getString, 'enrolled.description', this.catalogEntry, this.option, this.access);
	}


	getDropButtonButtonLabel () {
		if (!this.getString) {
			return `!! Missing Enrolled Description for ${this.option.Class} !!`;
		}

		//TODO: Check the option for the drop button label

		return getTranslationFor(this.getString, 'enrolled.buttonLabel', this.catalogEntry, this.option, this.access);
	}
}
