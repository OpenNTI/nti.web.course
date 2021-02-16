import './Label.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { List, DateTime } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import RequirementControl from '../../../../progress/widgets/RequirementControl';
import Required from '../../common/Required';

const DEFAULT_TEXT = {
	draft: 'Draft',
	question: {
		one: '%(count)s Question',
		other: '%(count)s Questions',
	},
	submissions: {
		one: '%(count)s Submission',
		other: '%(count)s Submissions',
	},
	due: {
		today: 'Due Today at %(time)s',
		due: 'Due %(date)s',
		availableNow: 'Available Now',
		available: 'Available %(date)s',
	},
};
const t = scoped('course.overview.lesson.items.survey.Label', DEFAULT_TEXT);

const isToday = (...args) => DateTime.isToday(...args);

function getDueDate(item) {
	const published = item.isTargetPublished();
	const now = new Date();
	const available = item.getTargetAssignedDate();
	const due = item.getTargetDueDate();

	const format = date =>
		DateTime.format(date, DateTime.WEEKDAY_MONTH_NAME_DAY_TIME_WITH_ZONE);

	const dueToday = due > now && isToday(due);
	const late = due && due <= now;

	let text = '';

	if (dueToday) {
		text = t('due.today', {
			time: DateTime.format(due, DateTime.TIME_WITH_ZONE),
		});
	} else if (available > now && due > now) {
		text = t('due.available', { date: format(available) });
	} else if (due) {
		text = t('due.due', { date: format(due) });
	} else if (published && available < now) {
		text = t('due.availableNow');
	} else if (published && available) {
		text = t('due.available', { date: format(available) });
	}

	if (!text) {
		return null;
	}

	return <span className={cx('due', { today: dueToday, late })}>{text}</span>;
}

LessonOverviewSurveyLabel.propTypes = {
	item: PropTypes.object,
	onRequirementChange: PropTypes.func,
};
export default function LessonOverviewSurveyLabel({
	item,
	onRequirementChange,
}) {
	const required = (item || {}).CompletionRequired;
	const completable =
		(item || {}).isCompletable && (item || {}).isCompletable();

	return (
		<List.SeparatedInline className="lesson-overview-survey-label">
			{completable && onRequirementChange ? (
				<RequirementControl
					record={item}
					onChange={onRequirementChange}
				/>
			) : (
				required && <Required />
			)}
			{!item.isTargetPublished() && (
				<span className="draft">{t('draft')}</span>
			)}
			<span className="question-count">
				{t('question', { count: item.getQuestionCount() })}
			</span>
			<span className="submissions">
				{t('submissions', { count: item.submissions })}
			</span>
			{getDueDate(item)}
		</List.SeparatedInline>
	);
}
