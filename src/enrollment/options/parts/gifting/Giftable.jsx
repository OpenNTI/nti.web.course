import React from 'react';
import PropTypes from 'prop-types';
import {LinkTo} from '@nti/web-routing';

import Item from './Item';

export default class CourseEnrollmentOptionsGiftingGiftable extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			getGiftTitle: PropTypes.func.isRequired,
			getGiftLabel: PropTypes.func
		}).isRequired
	}


	render () {
		const {option} = this.props;

		return (
			<LinkTo.Object object={option} context="gift">
				<Item
					title={option.getGiftTitle()}
					label={option.getGiftLabel && option.getGiftLabel()}
				/>
			</LinkTo.Object>
		);
	}
}
