import React from 'react';
import PropTypes from 'prop-types';

import { Selector } from '@nti/web-profiles';

export default class EnrollmentAdminPickUser extends React.Component {
	static propTypes = {
		onUserSelected: PropTypes.func,
	};

	onSelect = user => {
		const { onUserSelected } = this.props;

		if (onUserSelected) {
			onUserSelected(user);
		}
	};

	render() {
		return <Selector onSelect={this.onSelect} />;
	}
}
