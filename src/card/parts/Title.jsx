import React from 'react';
import PropTypes from 'prop-types';

import {getSemesterBadge} from '../../utils/Semester';

CourseCardTitle.propTypes = {
	course: PropTypes.shape({
		ProviderUniqueID: PropTypes.string,
		Title: PropTypes.string
	}),
	// hideSemester: PropTypes.bool
};

export default function CourseCardTitle ({course}) {
	const dateText = getSemesterBadge(course);

	return (
		<div className="nti-course-card-title">
			<div className="provider-unique-id">{course.ProviderUniqueID}</div>
			{dateText &&
				<div className="course-date">{dateText}</div>
			}
			<div className="title">{course.Title}</div>
		</div>
	);
}
