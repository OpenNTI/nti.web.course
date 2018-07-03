import {scoped} from '@nti/lib-locale';

import Base from '../base';
import Registry from '../Registry';
import {isArchived, getCatalogEntryData} from '../../utils';

const t = scoped('course.enrollment.types.open', {
	notEnrolled: {
		title: {
			active: 'Basic',
			archived: 'Archived'
		},
		description: {
			active: 'Interact with content and connect with a community of learners.',
			archived: 'Interact with content and connect with a community of learners.'
		},
		buttonLabel: {
			active: 'Get for Free',
			archived: 'Get for Free'
		}
	},
	enrolled: {
		title: {
			active: 'Basic',
			archived: 'Archived'
		},
		description: {
			active: {
				startDate: 'Class begins %(fullStartDate)s and will be conducted fully online.',
				noStartDate: 'Class will be conducted fully online.'
			},
			archived: {
				endDate: 'This course ended on %(fullEndDate)s. The content of this course will remain available for you to review at any time.',
				noEndDate: 'The content of this course will remain available for you to review at any time'
			}
		},
		buttonLabel: {
			enrolledBeforeArchived: 'Drop the Open Course',
			enrolledAfterArchived: 'Drop the Archived Course'
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
			return data.fullEndDate ?
				t('enrolled.description.archived.endDate', data) :
				t('enrolled.description.acrhived.noEndDate', data);
		}

		return data.fullStartDate ?
			t('enrolled.description.active.startDate', data) :
			t('enrolled.description.active.noStartDate', data);
	}


	getDropButtonLabel () {
		const {catalogEntry} = this;
		const data = getCatalogEntryData(catalogEntry);

		return this.enrolledBeforeArchived() ?
			t('enrolled.buttonLabel.enrolledBeforeArchived', data) :
			t('enrolled.buttonLabel.enrolledAfterArchived', data);
	}
}
