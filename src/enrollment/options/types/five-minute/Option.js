import { scoped, getLocalizedCurrencyString } from '@nti/lib-locale';
import { getAppUser } from '@nti/web-client';

import { getTranslationFor } from '../../utils';
import Base from '../base';
import Registry from '../Registry';

import Description from './Description';
import EnrollButton from './EnrollButton';
import DropButton from './DropButton';

const t = scoped('course.enrollment.types.five-minute', {
	enrolled: {
		title: 'For Credit',
		description: {
			archived:
				'Thanks for your participation! The content of this course will remain available for you to review at any time.',
			'notArchived-startDate':
				'Class begins %(fullStartDate)s and will be conducted fully online.',
			'notArchived-noStartDate': 'Class will be conducted fully online.',
		},
		dropLabel: '',
		openLabel: 'Open',
		getAcquainted: 'Get Acquainted with the Platform',
		completeProfile: 'Complete Your Profile',
	},
	notEnrolled: {
		title: 'For Credit',
		description: {
			noCutOff:
				'Earn transcripted college credit from the University of Oklahoma.',
			hasCutOff:
				'Earn transcripted college credit from the University of Oklahoma.  Not available after %(enrollCutOffDate)s.',
		},
		buttonLabel: {
			anonymous: 'Sign In To Get Started',
			hasPrice: 'Buy for $%(price)s',
			noPrice: 'Earn College Credit',
		},
	},
	pending: {
		label: 'Admission Pending...',
		description:
			"We're processing your request to earn college credit. This process should take no more than two business days. If you believe there has been an error, please contact <a class='link' href='mailto:support@nextthought.com'>help desk.</a>",
	},
	rejected: {
		title: 'We are unable to confirm your eligibility to enroll through this process.',
		description:
			"<a class='link' href='mailto:support@nextthought.com'>Contact the Help desk</a>",
	},
	apiDown: {
		description:
			"Transcripted credit is available from the University of Oklahoma but unfortunately we cannot process an application at this time. Please contact the <a class='link' href='mailto:support@nextthought.com'>help desk.</a>",
	},
	seatsAvailable: {
		zero: 'No Seats Remaining',
		one: '%(count)s Seat Available',
		other: '%(count)s Seats Available',
	},
	dropInfo: {
		title: 'How do I drop?',
		description:
			'Please contact your site administrator for assistance dropping the course.',
	},
});

function handles(option) {
	return (
		option.MimeType ===
		'application/vnd.nextthought.courseware.fiveminuteenrollmentoption'
	);
}

export default class FiveMinuteEnrollmentOption extends Base {
	ORDER = 3;
	SCOPE = 'ForCredit';

	getString = t;

	Description = Description;
	EnrollButton = EnrollButton;
	DropButton = DropButton;

	isPending() {
		return this.admissionState === 'Pending';
	}

	isRejected() {
		return this.admissionState === 'Rejected';
	}

	isApiDown() {
		return this.apiDown;
	}

	getAvailableSeats() {
		return this.availableSeats;
	}

	getPrice() {
		return this.option.OU_Price;
	}

	getPriceDisplay() {
		// specific case where we can assume USD
		return getLocalizedCurrencyString(this.getPrice(), 'USD');
	}

	getEnrollCutOffDate() {
		return (
			this.option.getEnrollCutOffDate && this.option.getEnrollCutOffDate()
		);
	}

	async load() {
		if (!this.isAvailable() && !this.isEnrolled()) {
			return;
		}

		try {
			const user = await getAppUser();

			this.admissionState = user.admission_status;
		} catch (e) {
			this.admissionState = null;
		}

		try {
			const resp = await this.option.fetchLink({
				mode: 'raw',
				rel: 'fmaep.course.details',
			});

			this.availableSeats = resp.Course.SeatAvailable;
		} catch (e) {
			this.apiDown = true;
		}
	}

	getPendingLabel() {
		return getTranslationFor(
			this.getString,
			'pending.label',
			this.catalogEntry,
			this.option,
			this.access
		);
	}

	getPendingDescription() {
		return getTranslationFor(
			this.getString,
			'pending.description',
			this.catalogEntry,
			this.option,
			this.access
		);
	}

	getRejectedTitle() {
		return getTranslationFor(
			this.getString,
			'rejected.title',
			this.catalogEntry,
			this.option,
			this.access
		);
	}

	getRejectedDescription() {
		return getTranslationFor(
			this.getString,
			'rejected.description',
			this.catalogEntry,
			this.option,
			this.access
		);
	}

	getApiDownDescription() {
		return getTranslationFor(
			this.getString,
			'apiDown.description',
			this.catalogEntry,
			this.option,
			this.access
		);
	}

	getAvailabelSeatsLabel() {
		return this.getString('seatsAvailable', { count: this.availableSeats });
	}

	getDropInfoTitle() {
		return getTranslationFor(
			this.getString,
			'dropInfo.title',
			this.catalogEntry,
			this.option,
			this.access
		);
	}

	getDropInfoDescription() {
		return getTranslationFor(
			this.getString,
			'dropInfo.description',
			this.catalogEntry,
			this.option,
			this.access
		);
	}

	getGetAcquaintedWith() {
		return getTranslationFor(
			this.getString,
			'enrolled.getAcquainted',
			this.catalogEntry,
			this.option,
			this.access
		);
	}

	getCompleteProfile() {
		return getTranslationFor(
			this.getString,
			'enrolled.completeProfile',
			this.catalogEntry,
			this.option,
			this.access
		);
	}
}

Registry.register(handles)(FiveMinuteEnrollmentOption);
