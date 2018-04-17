import React from 'react';
import PropTypes from 'prop-types';

import Tool from './Tool';

const ToolList = ({ items }) => (
	<div className="lti-tool-list">
		<ul className="lti-configured-tools">
			{items.map(tool => <Tool key={tool.getID()} item={tool} />)}
		</ul>
	</div>
);

ToolList.propTypes = {
	items: PropTypes.array.isRequired
};

export default ToolList;
