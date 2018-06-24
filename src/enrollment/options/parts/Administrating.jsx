import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {DateTime} from '@nti/web-commons';

import Title from '../common/Title';
import Description from '../common/Description';

const t = scoped('course.enrollment.options.Administrating', {
	title: 'Administrating',
	description: {
		startDate: 'You are administering this course. Class begins %(startDate)s and will be conducted fully online.',
		noStartDate: 'You are administering this course. Class will be conducted fully online.'
	}
});

export default class CourseEnrollmentOptionsAdministrating extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.shape({
			getStartDate: PropTypes.func
		})
	}

	render () {
		return (
			<div className="course-enrollment-options-administrating">
				<Title>{t('title')}</Title>
				<Description>{this.renderDescription()}</Description>
			</div>
		);
	}


	renderDescription () {
		const {catalogEntry} = this.props;
		const startDate = catalogEntry.getStartDate();

		return startDate ?
			t('description.startDate', {startDate: DateTime.format(startDate, 'MMMM Do, h:mm A z')}) :
			t('description.noStartDate');
	}
}