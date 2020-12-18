import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {DateTime, Text} from '@nti/web-commons';

import Styles from './Style.css';

const t = scoped('course.progress.remaining-items.items.CompletionStatus', {
	completed: 'Completed %(date)s',
	overdue: 'Overdue %(date)s',
	graded: 'Graded %(date)s',
	pendingGrade: 'Pending Grade'
});

const formatDate = date => DateTime.format(date, 'M/DD');

const isAssignment = ({assignment}) => Boolean(assignment);
const isNoSubmitAssignment = ({assignment:a, assignmentHistory:h}) => (a && a.isNonSubmit()) || (h && h.isSyntheticSubmission());
const isSubmittedAssignment = ({assignmentHistory: h}) => h?.isSubmitted();
const isAssignmentCompleted = ({assignment}) => Boolean(assignment?.CompletedItem);

const getAssignmentGradedDate = ({assignmentHistory: h}) => h?.grade?.getCreatedTime();
const getAssignmentDueDate = ({assignment}) => assignment.getDueDate();

function getCompletedDate (item, completed) {
	if (!item) { return null; }
	if (!completed || item.CompletedItem) { return item.getCompletedDate?.(); }

	return completed[item.NTIID] || completed[item.href] || completed[item['Target-NTIID']] || completed['target-NTIID'];
}


const Statuses = [
	//Assignment Pending Grade
	{
		handles: (props) => {
			if (!isAssignment(props) || !isSubmittedAssignment(props)) { return false; }

			return !isAssignmentCompleted(props);
		},
		getLabel: () => t('pendingGrade')
	},

	//Assignment Graded
	{
		handles: (props) => isAssignment(props) && isSubmittedAssignment(props),
		getLabel: (props) => t('graded', {date: formatDate(getAssignmentGradedDate(props))})
	},


	//Assignment Overdue
	{
		handles: (props) => {
			if (!isAssignment(props) || isNoSubmitAssignment(props) || isSubmittedAssignment(props)) { return false; }

			const dueDate = getAssignmentDueDate(props);

			return dueDate && dueDate <= Date.now();
		},
		getClass: () => Styles.overdue,
		getLabel: (props) => t('overdue', {date: formatDate(getAssignmentDueDate(props))})
	},

	//Default
	{
		handles: () => true,
		getLabel: ({item, completedItemsOverride}) => {
			const completedDate = getCompletedDate(item, completedItemsOverride);
			const date = completedDate && formatDate(new Date(completedDate));

			return date && t('completed', {date});
		}
	}
];

CompletionStatus.completedSuccessfully = item => item?.completedSuccessfully?.() ?? (item?.CompletedItem?.Success === true);
CompletionStatus.getCompletedDate = getCompletedDate;
CompletionStatus.cssClassName = Styles['completion-status-cell'];
CompletionStatus.propTypes = {
	item: PropTypes.shape({
		getCompletedDate: PropTypes.func
	}),
	completedItemsOverride: PropTypes.object,

	assignment: PropTypes.object,
	assignmentSubmission: PropTypes.object
};
export default function CompletionStatus (props) {
	const status = Statuses.find(o => o.handles(props));
	const label = status?.getLabel?.(props);

	return (
		<div className={cx(Styles['completion-status'], status?.getClass?.(props))}>
			{label && (
				<Text.Base>
					{label}
				</Text.Base>
			)}
		</div>
	);
}
