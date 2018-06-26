import React from 'react';
import PropTypes from 'prop-types';

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
			<div className="nti-course-enrollment-options-enrolled">
				<div className="contents">
					<EnrolledTitle option={option} />
					<EnrolledDescription option={option} />
					{Actions && (<Actions option={option} />)}
				</div>
				{DropButton && (<DropButton option={option} />)}
			</div>
		);
	}
}
