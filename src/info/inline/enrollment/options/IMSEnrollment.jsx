import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

import EnrollmentCard from '../common/EnrollmentCard';

const t = scoped('course.info.inline.enrollment.options.IMSEnrollment', {
	title: 'IMS',
	description: 'IMS Enrollment',
	sourcedID: 'Sourced ID'
});

export default class IMSEnrollment extends React.Component {
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
				postTitleCmp={<div className="dot-suffix"><span className="value">{this.props.option.SourcedID}</span></div>}
				className="ims"
			/>
		);
	}
}
