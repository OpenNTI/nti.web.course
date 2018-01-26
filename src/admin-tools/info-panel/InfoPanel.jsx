import React from 'react';
import PropTypes from 'prop-types';

import Tool from './Tool';
// import DashboardIcon from './assets/dashboard.svg';
import ReportsIcon from './assets/reports.svg';
import RosterIcon from './RosterIcon';

const InfoPanel = ({ totalLearners }) => (
	<div className="course-admin-panel">
		<h2 className="admin-panel-header">Admin Tools</h2>
		{/* <Tool title="Dashboard" subtitle="Leverage data to form insights about your course." link={'admin-info-dashboard'} icon={DashboardIcon} /> */}
		<Tool title="Reports" subtitle="Access a variety of downloadable reports to share with peers." link={'admin-info-reports'} icon={ReportsIcon} />
		<Tool title="Roster" subtitle="Manage and communicate with groups of learners." link={'admin-info-roster'} icon={<RosterIcon totalLearners={totalLearners} />} />
	</div>
);

InfoPanel.propTypes = {
	totalLearners: PropTypes.number
};

export default InfoPanel;