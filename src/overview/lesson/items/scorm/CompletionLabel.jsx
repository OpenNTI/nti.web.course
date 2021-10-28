import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { DateTime } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import {
	getCompletedDate,
	getCompletedStatus,
	Success,
	Failed,
	Incomplete,
} from '../utils';

import Styles from './CompletionLabel.css';

const cx = classnames.bind(Styles);
const t = scoped('course.overview.lesson.items.scorm.CompletionLabel', {
	failed: 'Not Satisfactory',
	success: 'Completed %(date)s',
});

CompletionLabel.isCompleted = (item, completedItemsOverride) =>
	getCompletedStatus(item, completedItemsOverride) !== Incomplete;

CompletionLabel.propTypes = {
	item: PropTypes.object,
	completedItemsOverride: PropTypes.object,
};
export default function CompletionLabel({ item, completedItemsOverride }) {
	const status = getCompletedStatus(item, completedItemsOverride);

	if (!item.isCompletable || status === Incomplete) {
		return null;
	}

	const date = getCompletedDate(item, completedItemsOverride);

	const formattedDate = date
		? DateTime.format(date, DateTime.MONTH_NAME_DAY_YEAR_AT_TIME)
		: '';

	const success = status === Success;
	const failed = status === Failed;

	return (
		<span className={cx('scorm-completion-label', { success, failed })}>
			{success && t('success', { date: formattedDate })}
			{failed && t('failed')}
		</span>
	);
}
