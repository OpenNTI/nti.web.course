import React from 'react';
import PropTypes from 'prop-types';
import {LinkTo} from '@nti/web-routing';

import Item from './Item';

export default class CourseEnrollmentOptionsGiftingGiftable extends React.Component {
	static propTypes = {
		option: PropTypes.shape({
			getRedeemTitle: PropTypes.func.isRequired,
			getRedeemLabel: PropTypes.func
		}).isRequired
	}


	render () {
		const {option} = this.props;

		return (
			<LinkTo.Object object={option} context="redeem">
				<Item
					title={option.getRedeemTitle()}
					label={option.getRedeemLabel && option.getRedeemLabel()}
				/>
			</LinkTo.Object>
		);
	}
}
