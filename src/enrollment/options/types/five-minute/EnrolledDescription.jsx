import React from 'react';
import PropTypes from 'prop-types';

import {isArchived, getCatalogEntryData} from '../../utils';
import Description from '../../common/Description';

import t from './wording';

export default class CourseEnrollmentFiveMinuteTypeEnrolledDescription extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object
	}


	render () {
		const {catalogEntry} = this.props;
		const data = getCatalogEntryData(catalogEntry);

		return (
			<Description>
				{isArchived(catalogEntry) ? this.renderArchived(data) : this.renderActive(data)}
			</Description>
		);
	}


	renderArchived (data) {
		return t('enrolled.description.archived', data);
	}

	renderActive (data) {
		return data.fullStartDate ? t('enrolled.description.active.startDate', data) : t('enrolled.description.active.noStartDate', data);
	}
}
