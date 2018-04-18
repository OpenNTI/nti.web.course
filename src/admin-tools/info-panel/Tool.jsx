import React from 'react';
import PropTypes from 'prop-types';
import { LinkTo } from '@nti/web-routing';

const Tool = ({ title, subtitle, icon, link }) => (
	<div className="admin-info-tool">
		<div className="tool-icon-wrapper">
			{typeof icon === 'string' ? <img className="tool-icon" src={icon} /> : icon}
		</div>
		<div className="tool-content">
			<div className="tool-title">{title}</div>
			<div className="tool-subtitle">{subtitle}</div>
			<LinkTo.Name name={link} className="tool-link">View Now</LinkTo.Name>
		</div>
	</div>
);

Tool.propTypes = {
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string.isRequired,
	icon: PropTypes.oneOf([PropTypes.string, PropTypes.element]),
	link: PropTypes.string.isRequired
};

export default Tool;