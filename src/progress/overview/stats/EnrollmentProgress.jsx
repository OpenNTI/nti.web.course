import React from 'react';
import PropTypes from 'prop-types';
import {Avatar, DisplayName} from 'nti-web-commons';
import {CircularProgress} from 'nti-web-charts';


ProgressOverviewStatsEnrollment.propTypes = {
	enrollment: PropTypes.object
};
export default function ProgressOverviewStatsEnrollment ({enrollment}) {
	const {UserProfile, CourseProgress} = enrollment;
	const progress = Math.floor((CourseProgress.PercentageProgress || 0) * 100);

	return (
		<div className="progress-overview-stats-enrollment-progress">
			<div className="enrollment-info">
				<div className="avatar-container">
					<Avatar entity={UserProfile} />
					<CircularProgress value={progress} width={35} height={35} />
				</div>
				<DisplayName entity={UserProfile} />
			</div>
		</div>
	);
}
