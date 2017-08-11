import React from 'react';
import PropTypes from 'prop-types';

SwitchControls.propTypes = {
	children: PropTypes.node
};
export default function SwitchControls ({children, ...otherProps}) {
	return (
		<div {...otherProps}>
			{children}
		</div>
	);
}
