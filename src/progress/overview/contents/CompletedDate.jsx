import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

const t = scoped('course.progress.overview.contents.CompletedDate', {
	completed: 'Completed %(date)s'
});

ProgressOverviewContentsCompletedDate.propTypes = {
	item: PropTypes.object
};
export default function ProgressOverviewContentsCompletedDate ({item}) {
	const completedDate = item.getCompletedDate && item.getCompletedDate();

	if (!completedDate) { return null; }

	const date = DateTime.format(new Date(completedDate), 'M/DD');

	return (
		<div className="progress-overview-contents-completed-date">
			{t('completed', {date})}
		</div>
	);
}
