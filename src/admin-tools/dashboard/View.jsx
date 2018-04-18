import React from 'react';
import PropTypes from 'prop-types';
import { Widgets } from '@nti/web-reports';

import CourseStanding from '../../progress/overview/stats/charts/CourseStanding';

const { ActiveDays, ActiveUsers, ActiveTimes, Statistics } = Widgets;

CourseOverview.propTypes = {
	course: PropTypes.object
};
export default function CourseOverview ({course}) {
	const isCompletable = course.CompletionPolicy && course.hasLink('ProgressStats');

	return (
		<div className="course-admin-course-overview">
			<div className="admin-row">
				<div>
					<Statistics entity={course}/>
				</div>
				<div className="active-users">
					<ActiveUsers entity={course}/>
				</div>
			</div>
			{isCompletable && (
				<div className="course-progress">
					<div className="title">Progress</div>
					<CourseStanding course={course}/>
				</div>
			)}
			<div className="active-days">
				<ActiveDays entity={course}/>
			</div>
			<div className="active-times">
				<ActiveTimes course={course}/>
			</div>
		</div>
	);
}
