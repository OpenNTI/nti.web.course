import Base from '../base';
import Registry from '../Registry';
import {scoped} from '@nti/lib-locale';

import {isArchived, getCatalogEntryData} from '../../utils';

const t = scoped('course.enrollment.types.store', {
	notEnrolled: {
		title: {
			active: 'Candidate',
			archived: 'This Course is Archived'
		},
		description: {
			active: 'Gain complete access to all exam preparation materials in the course.',
			archived: 'Archived courses are out of session but all course content will remain available including the lectures, course materials, quizzes, and discussions.'
		},
		buttonLabel: {
			active: 'Enroll as a Lifelong Learner',
			archived: 'Add Archived Course'
		}
	},
	enrolled: {
		title: {
			active: 'You\'re Enrolled',
			archived: 'You took the Course'
		},
		description: {
			active: {
				startDate: 'Your access to exam preparation materials begins %(fullStartDate)s.',
				noStartDate: 'Your access to exam preparation materials begins now.'
			},
			archived: 'Thanks for your participation! The content of this course will remain available for you to review at any time.'
		}
	}
});

function handles (option) {
	return option.MimeType === 'application/vnd.nextthought.courseware.storeenrollmentoption';
}

@Registry.register(handles)
export default class StoreEnrollmentOption extends Base {
	ORDER = 2

	async load (option) {
		if (!this.isAvailable() && !this.isEnrolled()) {
			return;
		}
	}

	getTitle () {
		const {catalogEntry} = this;
		const data = getCatalogEntryData(catalogEntry);

		//TODO: check the option for the title

		return isArchived(catalogEntry) ?
			t('notEnrolled.title.archived', data) :
			t('notEnrolled.title.active', data);
	}


	getDescription () {
		const {catalogEntry} = this;
		const data = getCatalogEntryData(catalogEntry);

		//TODO: check the option for the description

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
