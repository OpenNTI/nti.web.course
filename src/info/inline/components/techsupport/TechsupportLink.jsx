import React from 'react';
import PropTypes from 'prop-types';

const TechsupportLink = ({ href, label }) => (
	<li className="techsupport-link">
		<a href={href} target="_blank">{label}</a>
	</li>
);

TechsupportLink.propTypes = {
	href: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired
};

export default TechsupportLink;