import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import { Widgets } from 'nti-web-reports';

const DEFAULT_TEXT = {
	totalEnrollments: 'Total Enrollments',
	somethingElse: 'Something Else'
};
const t = scoped('nti-web-compontent-course.admin.dashboard', DEFAULT_TEXT);
const { ActiveDays, ActiveUsers, ActiveTimes, LabeledValue } = Widgets;

CourseOverview.propTypes = {
	course: PropTypes.object
};
export default function CourseOverview ({course}) {
	return (
		<div className="course-admin-course-overview">
			<div className="admin-row">
				<div>
					<LabeledValue label={t('totalEnrollments')}>
						{course.enrolledTotalCount || 0}
					</LabeledValue>
				</div>
				<div className="active-users">
					<ActiveUsers entity={course}/>
				</div>
			</div>
			<div className="active-days">
				<ActiveDays entity={course}/>
			</div>
			<div className="active-times">
				<ActiveTimes course={course}/>
			</div>
		</div>
	);
}
