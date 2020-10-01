import './Label.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {List} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import RequirementControl from '../../../../progress/widgets/RequirementControl';
import Required from '../../common/Required';

const DEFAULT_TEXT = {
	draft: 'Draft',
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
	item: PropTypes.object,
	onRequirementChange: PropTypes.func
};
export default function LessonOverviewSurveyLabel ({item, onRequirementChange}) {
	const required = (item || {}).CompletionRequired;
	const completable = (item || {}).isCompletable && (item || {}).isCompletable();

	return (
		<List.SeparatedInline className="lesson-overview-survey-label">
			{completable && onRequirementChange ?
				(
					<RequirementControl record={item} onChange={onRequirementChange}/>
				)
				: required && <Required/>}
			{!item.isTargetPublished() && (<span className="draft">{t('draft')}</span>)}
			<span className="question-count">{t('question', {count: item.getQuestionCount()})}</span>
			<span className="submissions">{t('submissions', {count: item.submissions})}</span>
		</List.SeparatedInline>
	);
}
