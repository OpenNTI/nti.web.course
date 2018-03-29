import React from 'react';
import PropTypes from 'prop-types';
import {List} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import Required from '../../common/Required';

const DEFAULT_TEXT = {
	question: {
		one: '%(count)s Question',
		other: '%(count)s Questions'
	},
	submissions: {
		one: '%(count)s Submission',
		other: '%(count)s Submissions'
	}
};
const t = scoped('course.overview.lesson.items.survey.Label', DEFAULT_TEXT);


LessonOverviewSurveyLabel.propTypes = {
	item: PropTypes.object
};
export default function LessonOverviewSurveyLabel ({item}) {
	const required = (item || {}).CompletionRequired;

	return (
		<List.SeparatedInline className="lesson-overview-survey-label">
			{required && <Required/>}
			<span className="question-count">{t('question', {count: item.getQuestionCount()})}</span>
			<span className="submissions">{t('submissions', {count: item.submissions})}</span>
		</List.SeparatedInline>
	);
}
