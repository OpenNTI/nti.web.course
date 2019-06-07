import React from 'react';
import PropTypes from 'prop-types';

import Store from '../Store';

export default 
@Store.monitor(['uploadPackage', 'filter', 'setFilter'])
class ScormCollectionHeader extends React.Component {
	static propTypes = {
		uploadPackage: PropTypes.func,
		filter: PropTypes.string,
		setFilter: PropTypes.func
	}

	render () {
		return (
			<div>
				Header
			</div>
		);
	}
}
