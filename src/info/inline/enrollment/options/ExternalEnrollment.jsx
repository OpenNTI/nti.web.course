import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import cx from 'classnames';

import EnrollmentCard from '../common/EnrollmentCard';

const t = scoped('course.info.inline.enrollment.options.ExternalEnrollment', {
	title: 'External',
	description: 'Enroll using a URL',
	url: 'URL'
});

export default class ExternalEnrollment extends React.Component {
	static propTypes = {
		option: PropTypes.object.isRequired,
		addable: PropTypes.bool,
		editable: PropTypes.bool,
		onItemActivate: PropTypes.func,
		onItemDeactivate: PropTypes.func,
		customTitle: PropTypes.string,
		customDescription: PropTypes.string,
		className: PropTypes.string
	}

	state = {}

	render () {
		const cls = cx('external', this.props.className);

		return (
			<EnrollmentCard
				title={t('title')}
				description={t('description')}
				className={cls}
			>
				<div className="url">{this.props.option.enrollmentURL}</div>
			</EnrollmentCard>
		);
	}
}
