import React from 'react';
import PropTypes from 'prop-types';

import CourseSelector from '../../../selector';

export default class EnrollmentAdminPickCourse extends React.Component {
	static propTypes = {
		onCourseSelected: PropTypes.func,
	};

	onSelect = course => {
		const { onCourseSelected } = this.props;

		if (onCourseSelected) {
			onCourseSelected(course);
		}
	};

	render() {
		return (
			<CourseSelector
				onSelect={this.onSelect}
				collection="AdministeredCourses"
			/>
		);
	}
}
