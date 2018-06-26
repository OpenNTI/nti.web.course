import Base from '../base';
import Registry from '../Registry';
import {scoped} from '@nti/lib-locale';

import {isArchived, getCatalogEntryData} from '../../utils';

const t = scoped('course.enrollment.types.five-minute', {
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
		return this.option.OU_PRICE;
	}

	async load () {
		if (!this.isAvailable() && !this.isEnrolled()) {
			return;
		}
	}


	getEnrolledTitle (catalogEntry) {
		const data = getCatalogEntryData(catalogEntry);

		//TODO: check the option for the title

		return isArchived(catalogEntry) ?
			t('enrolled.title.archived', data) :
			t('enrolled.title.active', data);
	}


	getEnrolledDescription (catalogEntry) {
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
