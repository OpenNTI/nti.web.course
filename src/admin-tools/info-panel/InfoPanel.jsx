import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from 'nti-lib-locale';

import Tool from './Tool';
// import DashboardIcon from './assets/dashboard.svg';
import ReportsIcon from './assets/reports.svg';
import RosterIcon from './RosterIcon';

const TOOLS = {
	reportsTitle: 'Reports',
	reportsSubtitle: 'Access a variety of downloadable reports to share with peers.',
	rosterTitle: 'Roster',
	rosterSubtitle: 'Manage and communicate with groups of learners.'
};

const t = scoped('nti-web-compontent-course.admin-tools.info-panel.InfoPanel', TOOLS);

const InfoPanel = ({ totalLearners, showRoster, showReports }) => (
	<div className="course-admin-panel">
		<h2 className="admin-panel-header">Admin Tools</h2>
		{/* <Tool title="Dashboard" subtitle="Leverage data to form insights about your course." link={'admin-info-dashboard'} icon={DashboardIcon} /> */}
		{showReports && <Tool title={t('reportsTitle')} subtitle={t('reportsSubtitle')} link={'admin-info-reports'} icon={ReportsIcon} />}
		{showRoster && <Tool title={t('rosterTitle')} subtitle={t('rosterSubtitle')} link={'admin-info-roster'} icon={<RosterIcon totalLearners={totalLearners} />} />}
	</div>
);

InfoPanel.defaultProps = {
	showReports: false,
	showRoster: false
};

InfoPanel.propTypes = {
	totalLearners: PropTypes.number,
	showReports: PropTypes.bool,
	showRoster: PropTypes.bool
};

export default InfoPanel;