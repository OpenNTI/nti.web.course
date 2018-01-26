import React from 'react';
import PropTypes from 'prop-types';

const RosterIcon = ({ totalLearners = '' }) => (
	<div className="admin-roster-icon">
		<div className="roster-total-learners">{totalLearners}</div>
		<div className="roster-header">LEARNERS</div>
	</div>
);

RosterIcon.propTypes = {
	totalLearners: PropTypes.number
};

export default RosterIcon;
