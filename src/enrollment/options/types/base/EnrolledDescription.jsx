import React from 'react';
import PropTypes from 'prop-types';

import Description from '../../common/Description';

export default class BaseEnrolledDescription extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			getEnrolledDescription: PropTypes.func.isRequired
		}).isRequired,
		catalogEntry: PropTypes.object
	}

	render () {
		const {option, catalogEntry} = this.props;

		return (
			<Description>
				{option.getEnrolledDescription(catalogEntry)}
			</Description>
		);
	}
}
