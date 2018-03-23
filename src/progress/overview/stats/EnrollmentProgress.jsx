import React from 'react';
import PropTypes from 'prop-types';
import {Avatar, DisplayName} from 'nti-web-commons';


ProgressOverviewStatsEnrollment.propTypes = {
	enrollment: PropTypes.object
};
export default function ProgressOverviewStatsEnrollment ({enrollment}) {
	const {UserProfile} = enrollment;

	return (
		<div className="progress-overview-stats-enrollment-progress">
			<div className="enrollment-info">
				<div className="avatar-container">
					<Avatar entity={UserProfile} />
				</div>
				<DisplayName entity={UserProfile} />
			</div>
		</div>
	);
}
