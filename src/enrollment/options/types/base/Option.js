import { getTranslationFor } from '../../utils';

import Description from './Description';
import DropButton from './DropButton';
import EnrollButton from './EnrollButton';
import EnrolledTitle from './EnrolledTitle';
import EnrolledDescription from './EnrolledDescription';
import ListItem from './ListItem';
import OpenButton from './OpenButton';

export default class BaseEnrollment {
	static async load(option, access, catalogEntry) {
		const Cls = this;
		const enrollmentOption = new Cls(option, access, catalogEntry);

		await enrollmentOption.load();

		return enrollmentOption;
	}

	ORDER = 100;
	SCOPE = null;

	EnrolledTitle = EnrolledTitle;
	EnrolledDescription = EnrolledDescription;
	ListItem = ListItem;
	Description = Description;
	EnrollButton = EnrollButton;
	DropButton = DropButton;
	OpenButton = OpenButton;

	constructor(option, access, catalogEntry) {
		this.option = option;
		this.access = access;
		this.catalogEntry = catalogEntry;
	}

	isEnrolled() {
		return this.option && this.option.enrolled;
	}

	enrolledBeforeArchived() {
		const endDate = this.catalogEntry.getEndDate();
		const enrolledDate = this.access && this.access.getCreatedTime();

		return !endDate || (enrolledDate && enrolledDate < endDate);
	}

	isAvailable() {
		//If you are administrating a course no option is available;
		return (
			this.option &&
			(this.option.available || this.option.enrolled) &&
			(!this.access || !this.access.isAdministrative)
		);
	}

	shouldOverride() {
		return false;
	}

	getPrice() {
		return this.option.Price || null;
	}

	isGiftable() {
		return false;
	}

	isRedeemable() {
		return false;
	}

	isDisabled() {
		return false;
	}

	getScope() {
		return this.SCOPE;
	}

	getTitle(anonymous) {
		if (!this.getString) {
			return `!! Missing Title for ${this.option.Class} !!`;
		}

		//TODO: Check the option for the title

		return getTranslationFor(
			this.getString,
			'notEnrolled.title',
			this.catalogEntry,
			this,
			this.access,
			anonymous
		);
	}

	getDescription() {
		if (!this.getString) {
			return `!! Missing Description for ${this.option.Class} !!`;
		}

		//TODO: Check the option for the description

		return getTranslationFor(
			this.getString,
			'notEnrolled.description',
			this.catalogEntry,
			this,
			this.access
		);
	}

	getEnrollButtonLabel(isAnonymous) {
		if (!this.getString) {
			return `!! Missing Enroll Button Label for ${this.option.Class} !!`;
		}

		return getTranslationFor(
			this.getString,
			'notEnrolled.buttonLabel',
			this.catalogEntry,
			this,
			this.access,
			isAnonymous
		);
	}

	getEnrolledTitle() {
		if (!this.getString) {
			return `!! Missing Enrolled Title for ${this.option.Class} !!`;
		}

		//TODO: Check the option for the title

		return getTranslationFor(
			this.getString,
			'enrolled.title',
			this.catalogEntry,
			this,
			this.access
		);
	}

	getEnrolledDescription() {
		if (!this.getString) {
			return `!! Missing Enrolled Description for ${this.option.Class} !!`;
		}

		//TODO: Check the option for the description

		return getTranslationFor(
			this.getString,
			'enrolled.description',
			this.catalogEntry,
			this,
			this.access
		);
	}

	getDropButtonLabel() {
		if (!this.getString) {
			return `!! Missing Enrolled Description for ${this.option.Class} !!`;
		}

		//TODO: Check the option for the drop button label

		return getTranslationFor(
			this.getString,
			'enrolled.dropLabel',
			this.catalogEntry,
			this,
			this.access
		);
	}

	getOpenButtonLabel() {
		if (!this.getString) {
			return `!! Missing Open Button label for ${this.option.Class} !!`;
		}

		//TODO: Check the option for the open button label

		return getTranslationFor(
			this.getString,
			'enrolled.openLabel',
			this.catalogEntry,
			this,
			this.access
		);
	}
}
