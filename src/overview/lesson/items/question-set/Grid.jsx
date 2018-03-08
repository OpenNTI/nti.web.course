import React from 'react';
import PropTypes from 'prop-types';

import Base from '../../common/BaseAssessmentGridItem';

import AssessmentLabel from './AssessmentLabel';
import AssessmentIcon from './AssessmentIcon';
import AssignmentTitle from './AssignmentTitle';
import AssignmentIcon from './AssignmentIcon';
import AssignmentLabel from './AssignmentLabel';

export default class LessonOverviewQuestionSetGridItem extends React.Component {
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
				className="lesson-overview-question-set-grid-item"
				item={item}

				renderTitle={this.renderTitle}
				renderIcon={this.renderIcon}
				renderLabels={this.renderLabels}
			/>
		);
	}

	renderTitle = () => {
		const {assignment} = this.props;

		if (assignment) {
			return (
				<AssignmentTitle assignment={assignment} />
			);
		}
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
