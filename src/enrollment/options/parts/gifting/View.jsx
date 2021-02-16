import React from 'react';
import PropTypes from 'prop-types';

import Giftable from './Giftable';
import Redeemable from './Redeemable';

export default class CourseEnrollmentOptionsGifting extends React.Component {
	static propTypes = {
		options: PropTypes.arrayOf(
			PropTypes.shape({
				isGiftable: PropTypes.func.isRequired,
				isRedeemable: PropTypes.func.isRequired,
			})
		),
	};

	render() {
		const { options } = this.props;

		const giftable = options.find(option => option.isGiftable());
		const redeemable = options.find(option => option.isRedeemable());

		if (!giftable && !redeemable) {
			return null;
		}

		return (
			<div className="nti-course-enrollment-options-gifting">
				{giftable && <Giftable option={giftable} />}
				{redeemable && <Redeemable option={redeemable} />}
			</div>
		);
	}
}
