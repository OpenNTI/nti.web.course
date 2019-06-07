import React from 'react';
import PropTypes from 'prop-types';
import {LinkTo} from '@nti/web-routing';

export default class Package extends React.Component {
	static propTypes = {
		package: PropTypes.object,
		selected: PropTypes.bool
	}

	render () {
		const {package: pack} = this.props;

		return (
			<LinkTo.Object object={pack}>
				{pack.title}
			</LinkTo.Object>
		);
	}
}