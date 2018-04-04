import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import CourseStanding from './CourseStanding';

export default class ProgressOverviewStatsCharts extends React.Component {
	static propTypes = {
		enrollment: PropTypes.object,
		course: PropTypes.object,
		large: PropTypes.bool
	}


	render () {
		const {enrollment, course, large} = this.props;

		if (!course || !course.hasLink('ProgressStats')) { return null; }

		return (
			<div className={cx('progress-overview-stats-charts', {large})}>
				<div className="switcher">
					<span className="chart">
						{CourseStanding.label}
					</span>
				</div>
				<div className="active-chart">
					<CourseStanding course={course} enrollment={enrollment} large={large} />
				</div>
			</div>
		);
	}
}
