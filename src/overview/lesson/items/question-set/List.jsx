import React from 'react';
import PropTypes from 'prop-types';

import Base from '../../common/BaseListItem';

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
		assessmentSubmission: PropTypes.object
	}

	render () {
		const {item} = this.props;

		return (
			<Base
				className="lesson-overview-question-set-list-item"
				item={item}

				renderTitle={this.renderTitle}
				renderIcon={this.renderIcon}
				renderLabels={this.renderLabels}
			/>
		);
	}


	renderTitle = () => {
		const {assignment, item} = this.props;

		if (assignment) {
			return (
				<AssignmentTitle assignment={assignment} />
			);
		}

		return (item.title || item.label);
	}


	renderIcon = () => {
		const {assignment, assignmentHistory, assessment, assessmentSubmission} = this.props;

		if (assignment) {
			return (
				<AssignmentIcon assignment={assignment} assignmentHistory={assignmentHistory} />
			);
		}


		if (assessment) {
			return (
				<AssessmentIcon assessment={assessment} assessmentSubmission={assessmentSubmission} />
			);
		}


		return (
			<div className="fallback-questionset-icon" />
		);
	}


	renderLabels = () => {
		const {assignment, assignmentHistory, assessment, assessmentSubmission} = this.props;

		if (assignment) {
			return (
				<AssignmentLabel assignment={assignment} assignmentHistory={assignmentHistory} />
			);
		}

		if (assessment) {
			return (
				<AssessmentLabel assessment={assessment} assessmentSubmission={assessmentSubmission} />
			);
		}
	}
}
