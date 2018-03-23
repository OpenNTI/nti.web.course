import React from 'react';
import PropTypes from 'prop-types';

import EnrollmentProgress from './EnrollmentProgress';
import Charts from './charts';

ProgressOverviewStats.propTypes = {
	course: PropTypes.object.isRequired,
	enrollment: PropTypes.object
};
export default function ProgressOverviewStats ({course, enrollment}) {
	return (
		<div className="progress-overview-stats">
			{enrollment && (<EnrollmentProgress course={course} enrollment={enrollment} />)}
			<Charts course={course} enrollment={enrollment} large={!enrollment} />
		</div>
	);
}
