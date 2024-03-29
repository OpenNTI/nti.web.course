import './List.scss';
import React from 'react';
import PropTypes from 'prop-types';

import Base from '../../common/BaseListItem';
import GridCompleteIcon from '../../common/GridCompleteIcon';

import AssessmentLabel from './AssessmentLabel';
import AssessmentIcon from './AssessmentIcon';
import AssignmentTitle from './AssignmentTitle';
import AssignmentIcon from './AssignmentIcon';
import AssignmentLabel from './AssignmentLabel';

export default class LessonOverviewQuestionSetListItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,

		assignment: PropTypes.object,
		assignmentHistory: PropTypes.object,

		assessment: PropTypes.object,
		assessmentSubmission: PropTypes.object,
	};

	render() {
		const { item, assignment, assessment, ...otherProps } = this.props;

		return (
			<Base
				{...otherProps}
				className="lesson-overview-question-set-list-item"
				item={item}
				assignment={assignment}
				assessment={assessment}
				disabled={!(assignment || assessment)}
				renderTitle={this.renderTitle}
				renderIcon={this.renderIcon}
				renderLabels={this.renderLabels}
				noCompletedStatus={!!assignment}
			/>
		);
	}

	renderTitle = () => {
		const { assignment, item } = this.props;

		if (assignment) {
			return <AssignmentTitle assignment={assignment} />;
		}

		return item.title || item.label;
	};

	renderIcon = () => {
		const {
			assignment,
			assignmentHistory,
			assessment,
			assessmentSubmission,
			item,
		} = this.props;

		const CompletedItem =
			item?.CompletedItem ||
			assignment?.CompletedItem ||
			assessment?.CompletedItem;
		const failed = CompletedItem && !CompletedItem.Success;

		if (item && item.hasCompleted && item.hasCompleted() && !failed) {
			return <GridCompleteIcon />;
		}

		if (assignment) {
			return (
				<AssignmentIcon
					assignment={assignment}
					assignmentHistory={assignmentHistory}
				/>
			);
		}

		if (assessment) {
			return (
				<AssessmentIcon
					assessment={assessment}
					assessmentSubmission={assessmentSubmission}
				/>
			);
		}

		return <div className="fallback-questionset-icon" />;
	};

	renderLabels = () => {
		const {
			assignment,
			assignmentHistory,
			assessment,
			assessmentSubmission,
		} = this.props;

		const required = (assignment || assessment || {}).CompletionRequired;

		return assignment ? (
			<AssignmentLabel
				assignment={assignment}
				assignmentHistory={assignmentHistory}
				required={required}
			/>
		) : assessment ? (
			<AssessmentLabel
				assessment={assessment}
				assessmentSubmission={assessmentSubmission}
				required={required}
			/>
		) : null;
	};
}
