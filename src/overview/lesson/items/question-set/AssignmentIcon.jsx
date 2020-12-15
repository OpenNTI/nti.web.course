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
	const CompletedItem = assignment?.CompletedItem;
	const completed = assignmentHistory?.Submission?.getCreatedTime() ?? CompletedItem?.getCompletedDate();
	const failed = CompletedItem?.Success === false;

	let cls = '';

	if (noSubmit) { cls = 'no-submit'; }
	if (completed) { cls = completed > due ? 'late' : 'on-time'; }
	if (due && due < now) { cls = 'late'; }
	if (failed) { cls = 'failed'; }

	return (
		<div className={cx('lesson-overview-assignment-icon', cls, {large, ['no-completion']: completed && !CompletedItem})} />
	);
}
