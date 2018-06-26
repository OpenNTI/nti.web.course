import React from 'react';
import PropTypes from 'prop-types';

import { Unpublished } from '../Constants';

const STATE_MAP = {
	[Unpublished]: 'Draft'
};

const PublishState = ({ publishState }) => (
	<div className="publish-state">
		{STATE_MAP[publishState]}
	</div>
);

PublishState.propTypes = {
	publishState: PropTypes.string.isRequired
};

export default PublishState;
