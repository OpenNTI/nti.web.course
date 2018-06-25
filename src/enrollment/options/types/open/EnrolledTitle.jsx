import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import {isArchived, getCatalogEntryData} from '../../utils';
import Title from '../../common/Title';

import t from './wording';

export default class CourseEnrollmentOpenTypeEnrolledTitle extends React.Component {
	static propTypes = {
		option: PropTypes.object,
		catalogEntry: PropTypes.shape({
			getEndDate: PropTypes.func
		})
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
