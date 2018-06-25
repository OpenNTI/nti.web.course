import React from 'react';
import PropTypes from 'prop-types';

import {isArchived, getCatalogEntryData} from '../../utils';
import Title from '../../common/Title';

import t from './wording';

export default class CourseEnrollmentFiveMinuteTypeEnrolledTitle extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object
	}


	render () {
		const {catalogEntry} = this.props;
		const data = getCatalogEntryData(catalogEntry);

		return (
			<Title>
				{
					isArchived(catalogEntry) ?
						t('enrolled.title.archived', data) :
						t('enrolled.title.active', data)
				}
			</Title>
		);
	}
}
