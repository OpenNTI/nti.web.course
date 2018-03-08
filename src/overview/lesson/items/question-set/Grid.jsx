import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import Base from '../../common/BaseAssessmentGridItem';

import AssessmentLabel from './AssessmentLabel';
import AssessmentIcon from './AssessmentIcon';
import AssignmentTitle from './AssignmentTitle';
import AssignmentIcon from './AssignmentIcon';
import AssignmentLabel from './AssignmentLabel';

const DEFAULT_TEXT = {
	review: 'Review',
	start: 'Start',
	view: 'View'
};
const t = scoped('course.overview.lesson.items.questionset.Grid', DEFAULT_TEXT);

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
				renderButton={this.renderButton}
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
				<AssignmentIcon assignment={assignment} assignmentHistory={assignmentHistory} large />
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


	renderButton = () => {
		const {assignment} = this.props;

		return assignment ? this.renderAssignmentButton() : this.renderAssessmentButton();
	}


	renderAssignmentButton () {
		const {assignment, assignmentHistory} = this.props;
		const parts = assignment.parts || [];
		const startDate = assignment.getAvailableForSubmissionBeginning();
		const dueDate = assignment.getAvailableForSubmissionEnding();
		const now = new Date();

		let text = '';

		if (assignment.isNonSubmit()) {
			text = t('start');
		} else if (dueDate && dueDate < now) {
			text = t('start');
		} else if (!startDate || startDate >= now) {
			text = t('start');
		} else if (startDate && startDate > now) {
			text = '';
		} else if (parts.length === 0 && !assignment.isTimed) {
			text = t('review');
		}

		return this.renderButtonText(text);
	}


	renderAssessmentButton () {
		const {assessmentSubmission} = this.props;

		let text = '';

		if (!assessmentSubmission) {
			text = t('start');
		} else {
			text = t('review');
		}

		return this.renderButtonText(text);
	}

	renderButtonText (text) {
		return !text ? null : (
			<Button rounded>
				{text}
			</Button>
		);
	}
}
