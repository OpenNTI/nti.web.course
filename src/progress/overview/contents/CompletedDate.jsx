import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import {getCompletedDate} from './utils';

const t = scoped('course.progress.overview.contents.CompletedDate', {
	completed: 'Completed %(date)s'
});

ProgressOverviewContentsCompletedDate.propTypes = {
	item: PropTypes.object,
	completedItems: PropTypes.object
};
export default function ProgressOverviewContentsCompletedDate ({item, completedItems}) {
	if (!completedItems) { return null; }

	const completedDate = getCompletedDate(item, completedItems);

	if (!completedDate) { return null; }

	const date = DateTime.format(new Date(completedDate), 'M/DD');

	return (
		<div className="progress-overview-contents-completed-date">
			{t('completed', {date})}
		</div>
	);
}
