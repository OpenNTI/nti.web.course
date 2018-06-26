import Base from '../base';
import Registry from '../Registry';
import {scoped} from '@nti/lib-locale';

import {isArchived, getCatalogEntryData} from '../../utils';

const t = scoped('course.enrollment.types.store', {
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
