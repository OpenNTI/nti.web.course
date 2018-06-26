import React from 'react';
import PropTypes from 'prop-types';

export default class CourseEnrollmentOptionDescription extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			Description: PropTypes.func.isRequired,
			Highlights: PropTypes.func,
			EnrollButton: PropTypes.func
		}).isRequired
	}


	render () {
		const {option} = this.props;
		const {
			Description,
			Highlights,
			EnrollButton
		} = option;

		return (
			<div className="nti-course-enrollment-options-option-description">
				<div className="contents">
					<Description option={option} />
					{Highlights && (<Highlights option={option} />)}
				</div>
				{EnrollButton && (<EnrollButton option={option} />)}
			</div>
		);
	}
}
