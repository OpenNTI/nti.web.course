import React from 'react';
import PropTypes from 'prop-types';

import {getTypeFor} from '../types';

export default class CourseEnrollmentEnrolled extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			EnrolledTitle: PropTypes.func.isRequired,
			EnrolledDescription: PropTypes.func.isRequired,
			Actions: PropTypes.func,
			DropButton: PropTypes.func
		}).isRequired
	}

	render () {
		const {option} = this.props;
		const {
			EnrolledTitle,
			EnrolledDescription,
			Actions,
			DropButton
		} = option;

		return (
			<div className="course-enrollment-options-enrolled">
				<EnrolledTitle option={option} />
				<EnrolledDescription option={option} />
				{Actions && (<Actions option={option} />)}
				{DropButton && (<DropButton option={option} />)}
			</div>
		);
	}
}
