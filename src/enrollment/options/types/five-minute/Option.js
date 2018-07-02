import {scoped} from '@nti/lib-locale';

import Base from '../base';
import Registry from '../Registry';
import {isArchived, getCatalogEntryData} from '../../utils';

const t = scoped('course.enrollment.types.five-minute', {
	notEnrolled: {
		title: {
			active: 'Earn College Credit',
			archived: 'Earn College Credit'
		},
		description: {
			active: 'Earn transcripted college credit',
			archived: 'Earn transcripted college credit'
		},
		buttonLabel: {
			active: 'Earn College Credit',
			archived: 'Earn College Credit'
		}
	},
	enrolled: {
		title: {
			active: 'Enrolled for College Credit',
			archived: 'Enrolled for College Credit'
		},
		description: {
			active: {
				startDate: 'Class begins %(fullStartDate)s and will be conducted fully online.',
				noStartDate: 'Class will be conducted fully online.'
			},
			archived: 'Thanks for your particpation! The content of this course will remain available for you to review at any time.'
		}
	}
});

function handles (option) {
	return option.MimeType === 'application/vnd.nextthought.courseware.fiveminuteenrollmentoption';
}

@Registry.register(handles)
export default class FiveMinuteEnrollmentOption extends Base {
	ORDER = 3

	getPrice () {
		return this.option.OU_Price;
	}

	async load () {
		if (!this.isAvailable() && !this.isEnrolled()) {
			return;
		}
	}

	getTitle () {
		const {catalogEntry} = this;
		const data = getCatalogEntryData(catalogEntry);

		//TODO: check the option for the title
		//TODO: check if the admission is pending/reject or that the api is down

		return isArchived(catalogEntry) ?
			t('notEnrolled.title.archived', data) :
			t('notEnrolled.title.active', data);
	}


	getDescription () {
		const {catalogEntry} = this;
		const data = getCatalogEntryData(catalogEntry);

		//TODO: check the option for the title
		//TODO: check if the admission is pending/reject or that the api is down

		return isArchived(catalogEntry) ?
			t('notEnrolled.description.archived', data) :
			t('notEnrolled.description.active', data);
	}


	getEnrollButtonLabel () {
		const {catalogEntry} = this;
		const data = getCatalogEntryData(catalogEntry);

		//TODO: check the option for the button label

		return isArchived(catalogEntry) ?
			t('notEnrolled.buttonLabel.archived', data) :
			t('notEnrolled.buttonLabel.active', data);
	}


	getEnrolledTitle () {
		const {catalogEntry} = this;
		const data = getCatalogEntryData(catalogEntry);

		//TODO: check the option for the title

		return isArchived(catalogEntry) ?
			t('enrolled.title.archived', data) :
			t('enrolled.title.active', data);
	}


	getEnrolledDescription () {
		const {catalogEntry} = this;
		const data = getCatalogEntryData(catalogEntry);

		//TODO: check the option for the description

		if (isArchived(catalogEntry)) {
			return t('enrolled.description.archived', data);
		}

		return data.fullStartDate ?
			t('enrolled.description.active.startDate', data) :
			t('enrolled.description.active.noStartDate', data);
	}
}
