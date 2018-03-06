import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {List} from 'nti-web-commons';

const DEFAULT_TEXT = {
	questionCount: {
		one: '%(count)s Question',
		other: '%(count)s Questions'
	},
	correct: '%(correct)s Correct',
	incorrect: '%(incorrect)s Incorrect'
};
const t = scoped('course.overview.lesson.items.question-set.List', DEFAULT_TEXT);

LessonOverviewQuestionSetListItemAssessmentLabel.propTypes = {
	assessment: PropTypes.object,
	assessmentSubmission: PropTypes.object
};
export default function LessonOverviewQuestionSetListItemAssessmentLabel ({assessment, assessmentSubmission}) {
	const count = assessment ? parseInt(assessment['question-count'], 10) : 0;
	const correct = assessmentSubmission && assessmentSubmission.getCorrect();
	const incorrect = assessmentSubmission && assessmentSubmission.getIncorrect();

	return (
		<List.SeparatedInline className="lesson-overview-questionset-assessment-label">
			{!assessmentSubmission && (<span className="question-count">{t('questionCount', {count})}</span>)}
			{assessmentSubmission && (
				<div className="submitted">
					<span className="correct">
						<i className="icon-check" />
						<span>{t('correct', {correct})}</span>
					</span>
					<span className="incorrect">
						<i className="icon-bold-x" />
						<span>{t('incorrect', {incorrect})}</span>
					</span>
				</div>
			)}
		</List.SeparatedInline>
	);
}
