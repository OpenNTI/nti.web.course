import React from 'react';
import PropTypes from 'prop-types';

import Tool from './Tool';

const ToolList = ({ items }) => {

	if (items.length === 0) {
		return (
			<div className="list-tool-list empty-state">
				This course has zero configured tools.
			</div>
		);
	}

	return (
		<div className="lti-tool-list">
			<ul className="lti-configured-tools">
				{items.map(tool => <Tool key={tool.getID()} item={tool} />)}
			</ul>
		</div>
	);
};

ToolList.propTypes = {
	items: PropTypes.array.isRequired
};

export default ToolList;
