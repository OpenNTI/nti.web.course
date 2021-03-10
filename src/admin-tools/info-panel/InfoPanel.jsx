import './InfoPanel.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import Tool from './Tool';
// import DashboardIcon from './assets/dashboard.svg';
import ReportsIcon from './assets/reports.svg';
import RosterIcon from './RosterIcon';
import AdvancedIcon from './assets/advanced.svg';

const t = scoped('course.admin-tools.info-panel.InfoPanel', {
	reportsTitle: 'Reports',
	reportsSubtitle:
		'Access a variety of downloadable reports to share with peers.',
	rosterTitle: 'Roster',
	rosterSubtitle: 'Manage and communicate with groups of learners.',
	advancedTitle: 'Advanced',
	advancedSubtitle:
		'Manage advanced controls and integrate with other services.',
});

const InfoPanel = ({
	totalLearners,
	bundle,
	showRoster,
	showReports,
	showAdvanced,
}) => (
	<div className="course-admin-panel">
		<h2 className="admin-panel-header">Admin Tools</h2>
		{/* <Tool title="Dashboard" subtitle="Leverage data to form insights about your course." link={'admin-info-dashboard'} icon={DashboardIcon} /> */}
		{showReports && (
			<Tool
				title={t('reportsTitle')}
				bundle={bundle}
				subtitle={t('reportsSubtitle')}
				link={'admin-info-reports'}
				icon={ReportsIcon}
			/>
		)}
		{showRoster && (
			<Tool
				title={t('rosterTitle')}
				bundle={bundle}
				subtitle={t('rosterSubtitle')}
				link={'admin-info-roster'}
				icon={<RosterIcon totalLearners={totalLearners} />}
			/>
		)}
		{showAdvanced && (
			<Tool
				title={t('advancedTitle')}
				bundle={bundle}
				subtitle={t('advancedSubtitle')}
				link={'admin-info-advanced'}
				icon={AdvancedIcon}
			/>
		)}
	</div>
);

InfoPanel.defaultProps = {
	showReports: false,
	showRoster: false,
	showAdvanced: false,
};

InfoPanel.propTypes = {
	totalLearners: PropTypes.number,
	bundle: PropTypes.object,
	showReports: PropTypes.bool,
	showRoster: PropTypes.bool,
	showAdvanced: PropTypes.bool,
};

export default InfoPanel;
