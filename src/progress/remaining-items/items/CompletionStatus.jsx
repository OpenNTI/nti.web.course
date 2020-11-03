import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {DateTime, Text} from '@nti/web-commons';

import Styles from './Style.css';

const t = scoped('course.progress.remaining-items.items.CompletionStatus', {
	completed: 'Completed %(date)s'
});

CompletionStatus.cssClassName = Styles['completion-status-cell'];
CompletionStatus.propTypes = {
	item: PropTypes.shape({
		getCompletedDate: PropTypes.func
	})
};
export default function CompletionStatus ({item}) {
	const completedDate = item?.getCompletedDate?.();
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
