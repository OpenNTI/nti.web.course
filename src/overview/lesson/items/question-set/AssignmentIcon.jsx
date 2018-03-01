import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

LessonOverviewAssignmentIcon.propTypes = {
	assignment: PropTypes.object,
	assignmentHistory: PropTypes.object
};
export default function LessonOverviewAssignmentIcon ({assignment, assignmentHistory}) {
	const now = new Date();
	const due = assignment.getDueDate();
	const noSubmit = assignment.isNonSubmit();
	const completed = assignmentHistory && assignmentHistory.Submission && assignmentHistory.Submission.getCreatedTime();

	let cls = '';

	if (noSubmit) { cls = 'no-submit'; }
	if (completed) { cls = completed > due ? 'late' : 'on-time'; }
	if (due && due < now) { cls = 'late'; }

	return (
		<div className={cx('lesson-overview-assignment-icon', cls)} />
	);
}
