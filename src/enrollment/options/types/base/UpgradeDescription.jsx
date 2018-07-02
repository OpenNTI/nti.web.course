import React from 'react';
import PropTypes from 'prop-types';

import Description from '../../common/Description';

export default class BaseUpgradeDescription extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			getUpgradeDescription: PropTypes.func.isRequired
		}).isRequired
	}

	render () {
		const {option} = this.props;

		return (
			<Description>
				{option.getUpgradeDescription()}
			</Description>
		);
	}
}
