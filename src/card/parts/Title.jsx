import React from 'react';
import PropTypes from 'prop-types';

CourseCardTitle.propTypes = {
	course: PropTypes.shape({
		ProviderUniqueID: PropTypes.string,
		Title: PropTypes.string
	}),
	// hideSemester: PropTypes.bool
};
export default function CourseCardTitle ({course}) {
	return (
		<div className="nti-course-card-title">
			<div className="provider-unique-id">{course.ProviderUniqueID}</div>
			<div className="title">{course.Title}</div>
		</div>
	);
}
