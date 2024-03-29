import { scoped, getLocalizedCurrencyString } from '@nti/lib-locale';

import { getTranslationFor } from '../../utils';
import Base from '../base';
import Registry from '../Registry';

const t = scoped('course.enrollment.types.store', {
	enrolled: {
		title: 'Premium',
		description: {
			archived:
				'The course ended on %(fullEndDate)s. The content of this course will remain available for you to review at any time.',
			'notArchived-started':
				'You now have access to interact with all course content including the lectures, course materials, quizzes, and discussions.',
			'notArchived-startDate-notStarted':
				'The course begins on %(fullStartDate)s and will be conducted fully online.',
			'notAcrhived-noStartDate-notStarted':
				'The course will be conducted fully online.',
		},
		dropLabel: '',
		openLabel: 'Open',
	},
	notEnrolled: {
		title: 'Premium',
		description: 'Complete access to interact with all of the content.',
		buttonLabel: {
			'anonymous-seatAvailable': 'Sign In To Get Started',
			'seatAvailable-hasPrice': 'Buy for %(priceDisplay)s',
			'seatAvailable-noPrice': 'Purchase',
			noSeatAvailable: 'Not Available for Enrollment',
		},
	},
	gifting: {
		giftable: {
			title: 'Give This Course as a Gift',
			label: 'Lifelong Learner Only',
		},
		redeemable: {
			title: 'Redeem a Gift',
		},
	},
	disabled: {
		title: 'Unavailable',
		description:
			'Purchases are unavailable a this time. Please try again later.',
	},
});

function handles(option) {
	return (
		option.MimeType ===
		'application/vnd.nextthought.courseware.storeenrollmentoption'
	);
}

export default class StoreEnrollmentOption extends Base {
	ORDER = 2;
	SCOPE = 'Purchased';

	getString = t;

	getPrice() {
		return this.purchasable ? this.purchasable.amount : null;
	}

	getCurrency() {
		return this.purchasable && this.purchasable.currency;
	}

	getPriceDisplay() {
		return getLocalizedCurrencyString(this.getPrice(), this.getCurrency());
	}

	isGiftable() {
		return !!this.giftable;
	}

	isRedeemable() {
		return !!this.redeemable;
	}

	isDisabled() {
		const stripeConnectKey = this.option
			.getPurchasable()
			?.getStripeConnectKey();

		return !stripeConnectKey || !stripeConnectKey.PublicKey;
	}

	async load() {
		if (!this.isAvailable() && !this.isEnrolled()) {
			return;
		}

		this.purchasable = this.option.getPurchasable();
		this.giftable = this.option.getPurchasableForGifting();
		this.redeemable = this.option.getPurchasableForRedeeming();
	}

	getGiftTitle() {
		return getTranslationFor(
			this.getString,
			'gifting.giftable.title',
			this.catalogEntry,
			this.option,
			this.access
		);
	}

	getGiftLabel() {
		return getTranslationFor(
			this.getString,
			'gifting.giftable.label',
			this.catalogEntry,
			this.option,
			this.access
		);
	}

	getRedeemTitle() {
		return getTranslationFor(
			this.getString,
			'gifting.redeemable.title',
			this.catalogEntry,
			this.option,
			this.access
		);
	}

	getDisabledTitle() {
		return this.getString('disabled.title');
	}

	getDisabledDescription() {
		return this.getString('disabled.description');
	}
}

Registry.register(handles)(StoreEnrollmentOption);
