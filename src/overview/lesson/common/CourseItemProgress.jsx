import React from 'react';
import PropTypes from 'prop-types';
import {CircularProgress} from '@nti/web-charts';
import cx from 'classnames';

CourseItemProgress.propTypes = {
	item: PropTypes.object,
	progressByItems: PropTypes.object
};
export default function CourseItemProgress ({item, progressByItems}) {
	const progressMap = progressByItems || {};

	const itemProgress = progressMap[item.NTIID] || {};

	const CountCompleted = itemProgress.CountCompleted || 0;
	const TotalUsers = itemProgress.TotalUsers || 0;
	const pctComplete = TotalUsers === 0 ? 0 : parseInt(CountCompleted * 100.0 / TotalUsers, 10);
	const noProgress = CountCompleted === 0;
	const isComplete = TotalUsers === CountCompleted && TotalUsers !== 0;

	const className = cx('course-item-progress', { 'no-progress': noProgress });

	return (
		<div className={className}>
			<CircularProgress width="26" height="26" value={pctComplete} showValue={false} isComplete={isComplete}/>
			<div className="value">
				{pctComplete}%
			</div>
		</div>
	);
}
