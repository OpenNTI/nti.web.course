import React from 'react';
import PropTypes from 'prop-types';

const TechsupportLink = ({ href, label }) => (
	<li className="techsupport-link">
		{href ? (
			<a href={href} target="_blank" rel="noopener noreferrer">{label}</a>
		) : (
			<span>{label}</span>
		)}
	</li>
);

TechsupportLink.propTypes = {
	href: PropTypes.string,
	label: PropTypes.string.isRequired
};

export default TechsupportLink;
