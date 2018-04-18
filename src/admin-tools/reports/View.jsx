import React from 'react';
import PropTypes from 'prop-types';
import {Widgets, List} from '@nti/web-reports';

const { Card } = Widgets;

CourseAdminCourseReports.propTypes = {
	course: PropTypes.object
};

export default function CourseAdminCourseReports ({course}) {
	return course ?
		(<Card><List context={course} /></Card>) :
		null;
}
