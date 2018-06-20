import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

import EnrollmentCard from '../common/EnrollmentCard';

const t = scoped('course.info.inline.enrollment.options.OpenEnrollment', {
	title: 'Open Enroll',
	description: 'Get complete access to interact with all course content including the lectures, course materials, quizzes, and discussions once class is in session.',
	amount: 'Amount',
	free: 'Free'
});

export default class OpenEnrollment extends React.Component {
	static propTypes = {
		option: PropTypes.object.isRequired,
		addable: PropTypes.bool,
		editable: PropTypes.bool,
		onItemActivate: PropTypes.func,
		onItemDeactivate: PropTypes.func
	}

	state = {}

	render () {
		return (
			<EnrollmentCard
				title={t('title')}
				description={t('description')}
				postTitleCmp={<div className="dot-suffix"><span className="free value">$0</span></div>}
				className="open"
			/>
		);
	}
}
