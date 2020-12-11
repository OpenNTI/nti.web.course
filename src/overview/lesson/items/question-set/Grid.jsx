import './Grid.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import cx from 'classnames';

import Base from '../../common/BaseAssessmentGridItem';
import GridCompleteIcon from '../../common/GridCompleteIcon';

import AssessmentLabel from './AssessmentLabel';
import AssessmentIcon from './AssessmentIcon';
import AssignmentTitle from './AssignmentTitle';
import AssignmentIcon from './AssignmentIcon';
import AssignmentLabel from './AssignmentLabel';

const DEFAULT_TEXT = {
	tryAgain: 'Try Again',
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
		const classname = cx('lesson-overview-question-set-grid-item', { disabled: !(assignment || assessment) });
		return (
			<div>
				<Base
					className={classname}
					item={item}

					assignment={assignment}

					renderTitle={this.renderTitle}
					renderIcon={this.renderIcon}
					renderLabels={this.renderLabels}
					renderButton={this.renderButton}

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
		const {assignment, assignmentHistory, assessment, assessmentSubmission, item} = this.props;

		const CompletedItem = item?.CompletedItem || assignment?.CompletedItem || assessment?.CompletedItem;
		const failed = CompletedItem && !CompletedItem.Success;

		if(item && item.hasCompleted && item.hasCompleted() && !failed) {
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
		const {maxSubmissions, submissionCount} = assignment;
		const success = assignment?.CompletedItem?.Success;
		const startDate = assignment.getAvailableForSubmissionBeginning();
		const dueDate = assignment.getAvailableForSubmissionEnding();
		const now = new Date();

		let text = '';

		if (assignment.isNonSubmit()) {
			text = t('view');
		} else if (assignmentHistory) {
			text = maxSubmissions == null || success || maxSubmissions === submissionCount ? t('review') : t('tryAgain');
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
		const {assignment, assessment} = this.props;
		const blockNavigation = !(assessment || assignment);
		return !text ? null : (
			<Button as="span" disabled={this.state.inlineEditorExpanded || blockNavigation} rounded>
				{text}
			</Button>
		);
	}
}
