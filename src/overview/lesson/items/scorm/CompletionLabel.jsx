import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { DateTime } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import Styles from './CompletionLabel.css';

const cx = classnames.bind(Styles);
const t = scoped('course.overview.lesson.items.scorm.CompletionLabel', {
	failed: 'Not Satisfactory',
	success: 'Completed %(date)s',
});

CompletionLabel.propTypes = {
	item: PropTypes.object,
};
export default function CompletionLabel({ item }) {
	if (!item.isCompletable || !item.isCompletable() || !item.hasCompleted()) {
		return null;
	}

	const date = item.getCompletedDate();
	const formattedDate = date
		? DateTime.format(date, DateTime.MONTH_NAME_DAY_YEAR_AT_TIME)
		: '';

	const success = item.completedSuccessfully();
	const failed = item.completedUnsuccessfully();

	return (
		<span className={cx('scorm-completion-label', { success, failed })}>
			{success && t('success', { date: formattedDate })}
			{failed && t('failed')}
		</span>
	);
}
