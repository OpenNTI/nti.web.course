import React from 'react';
import PropTypes from 'prop-types';

import { LinkTo } from '@nti/web-routing';

export default class CourseOptionEnrollmentLink extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			option: PropTypes.object.isRequired,
		}).isRequired,
	};

	render() {
		const { option, ...otherProps } = this.props;

		return (
			<LinkTo.Object
				{...otherProps}
				object={option.option}
				context="enroll"
			/>
		);
	}
}
