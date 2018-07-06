import {scoped} from '@nti/lib-locale';

import {getTranslationFor} from '../../utils';
import Base from '../base';
import Registry from '../Registry';

const t = scoped('course.enrollment.types.store', {
	enrolled: {
		title: 'Premium',
		decription: {
			'archived': 'The course ended on %(fullEndDate)s. The content of this course will remain available for you to review at any time.',
			'notArchived-started': 'You now have access to interact with all course content including the lectures, course materials, quizzes, and discussions.',
			'notArchived-startDate-notStarted': 'The course begins on %(fullStartDate)s and will be conducted fully online.',
			'notAcrhived-noStartDate-notStarted': 'The course will be conducted fully online.'
		},
		buttonLabel: ''
	},
	notEnrolled: {
		title: 'Premium',
		description: 'Complete access to interact with all of the content.',
		buttonLabel: 'Purchase'
	},
	gifting: {
		giftable: {
			title: 'Give This Course as a Gift',
			label: 'Lifelong Leaner Only'
		},
		redeemable: {
			title: 'Redeem a Gift'
		}
	}
});


function handles (option) {
	return option.MimeType === 'application/vnd.nextthought.courseware.storeenrollmentoption';
}

@Registry.register(handles)
export default class StoreEnrollmentOption extends Base {
	ORDER = 2

	getString = t

	getPrice () {
		return this.purchasable ? this.purchasable.amount : null;
	}


	isGiftable () {
		return !!this.giftable;
	}


	isRedeemable () {
		return !!this.redeemable;
	}


	async load () {
		if (!this.isAvailable() && !this.isEnrolled()) {
			return;
		}

		this.purchasable = this.option.getPurchasable();
		this.giftable = this.option.getPurchasableForGifting();
		this.redeemable = this.option.getPurchasableForRedeeming();
	}


	getGiftTitle () {
		return getTranslationFor(this.getString, 'gifting.giftable.title', this.catalogEntry, this.option, this.access);
	}


	getGiftLabel () {
		return getTranslationFor(this.getString, 'gifting.giftable.label', this.catalogEntry, this.option, this.access);
	}


	getRedeemTitle () {
		return getTranslationFor(this.getString, 'gifting.redeemable.title', this.catalogEntry, this.option, this.access);
	}
}
