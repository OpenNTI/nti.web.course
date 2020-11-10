import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {DateTime, Text} from '@nti/web-commons';

import Styles from './Style.css';

const t = scoped('course.progress.remaining-items.items.CompletionStatus', {
	completed: 'Completed %(date)s'
});

function getCompletedDate (item, completed) {
	if (!item) { return null; }
	if (!completed) { return item.getCompletedDate?.(); }

	return completed[item.NTIID] || completed[item.href] || completed[item['Target-NTIID']] || completed['target-NTIID'];
}

CompletionStatus.getCompletedDate = getCompletedDate;
CompletionStatus.cssClassName = Styles['completion-status-cell'];
CompletionStatus.propTypes = {
	item: PropTypes.shape({
		getCompletedDate: PropTypes.func
	}),
	enrollmentCompletedItems: PropTypes.object
};
export default function CompletionStatus ({item, enrollmentCompletedItems}) {
	const completedDate = getCompletedDate(item, enrollmentCompletedItems);
	const date = completedDate && DateTime.format(new Date(completedDate), 'M/DD');

	return (
		<div className={cx(Styles['completion-status'], {[Styles.complete]: Boolean(completedDate)})}>
			{date && (
				<Text.Base>
					{t('completed', {date})}
				</Text.Base>
			)}
		</div>
	);
}
