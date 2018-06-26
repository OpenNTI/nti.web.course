import Base from '../base';
import Registry from '../Registry';
import {scoped} from '@nti/lib-locale';

import {isArchived, getCatalogEntryData} from '../../utils';

const t = scoped('course.enrollment.types.open', {
	notEnrolled: {
		title: {
			active: 'Take the Course For Free',
			archived: 'This Course iS Archived'
		},
		description: {
			active: 'Gain complete access to interact with all course content.',
			archived: 'Archived courses are out of session but all course content will remain available.'
		},
		buttonLabel: {
			active: 'Enroll in the Open Course',
			archived: 'Add Archived Course'
		}
	},
	enrolled: {
		title: {
			active: 'Enrolled in the open course',
			archived: 'Enrolled in the archived course'
		},
		description: {
			active: {
				startDate: 'Class begins %(fullStartDate)s and will be conducted fully online.',
				noStartDate: 'Class will be conducted fully online.'
			},
			archived: 'Thanks for your participation! The content of this course will remain available for you to review at any time.'
		}
	}
});

function handles (option) {
	return option.MimeType === 'application/vnd.nextthought.courseware.openenrollmentoption';
}

@Registry.register(handles)
export default class OpenEnrollmentOption extends Base {
	ORDER = 1

	async load () {
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
