import './AssignmentIcon.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

LessonOverviewAssignmentIcon.propTypes = {
	assignment: PropTypes.object,
	assignmentHistory: PropTypes.object,
	large: PropTypes.bool
};
export default function LessonOverviewAssignmentIcon ({assignment, assignmentHistory, large}) {
	const now = new Date();
	const due = assignment.getDueDate();
	const noSubmit = assignment.isNonSubmit();
	const completed = assignmentHistory && assignmentHistory.Submission && assignmentHistory.Submission.getCreatedTime();
	const hasCompletedItem = assignment?.CompletedItem;
	const failed = assignment && assignment.CompletedItem && !assignment.CompletedItem.Success;

	let cls = '';

	if (noSubmit) { cls = 'no-submit'; }
	if (completed) { cls = completed > due ? 'late' : 'on-time'; }
	if (due && due < now) { cls = 'late'; }
	if (failed) { cls = 'failed'; }

	return (
		<div className={cx('lesson-overview-assignment-icon', cls, {large, ['no-completion']: completed && !hasCompletedItem})} />
	);
}
