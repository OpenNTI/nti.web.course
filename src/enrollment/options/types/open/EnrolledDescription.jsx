import React from 'react';
import PropTypes from 'prop-types';

import {formatStartDate, isArchived} from '../../utils';
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
		const startDate = formatStartDate(catalogEntry);

		return startDate ? t('enrolled.description.active.startDate', {startDate}) : t('enrolled.description.active.noStartDate');
	}
}
