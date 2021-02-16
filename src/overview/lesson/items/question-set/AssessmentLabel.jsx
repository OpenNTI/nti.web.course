import './AssessmentLabel.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { List } from '@nti/web-commons';

import Required from '../../common/Required';
import RequirementControl from '../../../../progress/widgets/RequirementControl';

const t = scoped('course.overview.lesson.items.question-set.List', {
	questionCount: {
		one: '%(count)s Question',
		other: '%(count)s Questions',
	},
	correct: '%(correct)s Correct',
	incorrect: '%(incorrect)s Incorrect',
});

LessonOverviewQuestionSetAssessmentLabel.propTypes = {
	overviewItemRef: PropTypes.object,
	assessment: PropTypes.object,
	assessmentSubmission: PropTypes.object,
	required: PropTypes.bool,
	onRequirementChange: PropTypes.func,
	editMode: PropTypes.bool,
};
export default function LessonOverviewQuestionSetAssessmentLabel({
	assessment,
	assessmentSubmission,
	required,
	overviewItemRef,
	onRequirementChange,
}) {
	const count = assessment ? parseInt(assessment['question-count'], 10) : 0;
	const correct = assessmentSubmission && assessmentSubmission.getCorrect();
	const incorrect =
		assessmentSubmission && assessmentSubmission.getIncorrect();

	const requiredWidget =
		onRequirementChange &&
		overviewItemRef.isCompletable &&
		overviewItemRef.isCompletable() ? (
			<RequirementControl
				record={overviewItemRef}
				onChange={onRequirementChange}
			/>
		) : (
			required && <Required />
		);

	return (
		<List.SeparatedInline className="lesson-overview-questionset-assessment-label">
			{requiredWidget}
			{!assessmentSubmission && (
				<span className="question-count">
					{t('questionCount', { count })}
				</span>
			)}
			{assessmentSubmission && (
				<div className="submitted">
					<span className="correct">
						<i className="icon-check-10" />
						<span>{t('correct', { correct })}</span>
					</span>
					<span className="incorrect">
						<i className="icon-bold-x" />
						<span>{t('incorrect', { incorrect })}</span>
					</span>
				</div>
			)}
		</List.SeparatedInline>
	);
}
