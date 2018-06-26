import React from 'react';
import PropTypes from 'prop-types';

import Title from '../../common/Title';

export default class BaseEnrolledTitle extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			getEnrolledTitle: PropTypes.func.isRequired
		}).isRequired
	}

	render () {
		const {option} = this.props;

		return (
			<Title>
				{option.getEnrolledTitle()}
			</Title>
		);
	}
}
