import './Authors.scss';
import React from 'react';
import PropTypes from 'prop-types';

CourseCardAuthors.propTypes = {
	course: PropTypes.shape({
		getAuthorLine: PropTypes.func.isRequired
	}).isRequired
};
export default function CourseCardAuthors ({course}) {
	return (
		<div className="nti-course-card-authors">
			{course.getAuthorLine()}
		</div>
	);
}
