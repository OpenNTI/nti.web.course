import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import Title from '../../common/Title';

const t = scoped('course.enrollment.open.enrolled.title', {
	active: 'Enrolled in the open course',
	archived: 'Enrolled in the archived course'
});

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
						t('archived') :
						t('active')
				} 
			</Title>
		);
	}
}
