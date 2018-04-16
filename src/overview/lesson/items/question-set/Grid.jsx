import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import Base from '../../common/BaseAssessmentGridItem';
import GridCompleteIcon from '../../common/GridCompleteIcon';

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
		assessmentSubmission: PropTypes.object,

		onRequirementChange: PropTypes.func,
		editMode: PropTypes.bool
	}

	state = {
		statusExpanded: false
	}


	render () {
		const {item, assignment, assessment} = this.props;
		const {inlineEditorExpanded} = this.state;

		return (
			<div>
				<Base
					className="lesson-overview-question-set-grid-item"
					item={item}

					renderTitle={this.renderTitle}
					renderIcon={this.renderIcon}
					renderLabels={this.renderLabels}
					renderButton={this.renderButton}

					linkToObject={assignment || assessment}

					inlineEditorExpanded={inlineEditorExpanded}
					onEditorDismiss={this.onEditorDismiss}
				/>
			</div>
		);
	}

	onEditorDismiss = (savedData) => {
		this.setState({inlineEditorExpanded: false});
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

		const item = assignment || assessment;

		if(item && item.hasCompleted && item.hasCompleted()) {
			return (
				<div className="completable">
					<GridCompleteIcon/>
				</div>
			);
		}

		return assignment ? (
			<AssignmentIcon assignment={assignment} assignmentHistory={assignmentHistory} large />
		) : assessment ? (
			<AssessmentIcon assessment={assessment} assessmentSubmission={assessmentSubmission} />
		) : null;
	}


	onInlineEditorExpanded = () => {
		this.setState({inlineEditorExpanded: !this.state.inlineEditorExpanded});
	}


	renderLabels = () => {
		const {assignment, assignmentHistory, assessment, assessmentSubmission, onRequirementChange, item, editMode} = this.props;

		const required = item.CompletionRequired;

		if (assignment) {
			return (
				<AssignmentLabel
					overviewItemRef={item}
					assignment={assignment}
					assignmentHistory={assignmentHistory}
					required={required}
					onInlineEditorExpanded={this.onInlineEditorExpanded}
					statusExpanded={this.state.inlineEditorExpanded}
					onRequirementChange={onRequirementChange}
					editMode={editMode}
				/>
			);
		}

		if (assessment) {
			return (
				<AssessmentLabel
					overviewItemRef={item}
					assessment={assessment}
					assessmentSubmission={assessmentSubmission}
					onRequirementChange={onRequirementChange}
					required={required} />
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
			text = t('view');
		} else if (assignmentHistory) {
			text = t('review');
		} else if (dueDate && dueDate < now) {
			text = t('start');
		} else if (!startDate || now >= startDate) {
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
			<Button component="span" disabled={this.state.inlineEditorExpanded} rounded>
				{text}
			</Button>
		);
	}
}
