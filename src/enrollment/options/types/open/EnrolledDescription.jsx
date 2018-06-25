import React from 'react';
import PropTypes from 'prop-types';

import {getCatalogEntryData, isArchived} from '../../utils';
import Description from '../../common/Description';

import t from './wording';

export default class CourseEnrollmentOpenEnrolledDescription extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.shape({
			getStartDate: PropTypes.func,
			getEndDate: PropTypes.func
		})
	}

	render () {
		const {catalogEntry} = this.props;

		return (
			<Description>
				{isArchived(catalogEntry) ? this.renderArchived() : this.renderActive()}
			</Description>
		);
	}

	renderArchived () {
		return t('enrolled.description.archived');
	}


	renderActive () {
		const {catalogEntry} = this.props;
		const data = getCatalogEntryData(catalogEntry);

		return data.fullStartDate ? t('enrolled.description.active.startDate', data) : t('enrolled.description.active.noStartDate', data);
	}
}
