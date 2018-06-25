import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

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
		const endDate = catalogEntry.getEndDate();

		return (
			<Title>
				{
					endDate && endDate < Date.now() ?
						t('enrolled.title.archived') :
						t('enrolled.title.active')
				}
			</Title>
		);
	}
}
