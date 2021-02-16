import React from 'react';
import PropTypes from 'prop-types';

import EnrollmentCard from '../common/EnrollmentCard';
import OptionText, { TITLE, DESCRIPTION } from '../common/OptionText';

export default class StoreEnrollment extends React.Component {
	static propTypes = {
		option: PropTypes.object.isRequired,
	};

	state = {};

	render() {
		const { option } = this.props;

		let purchasables = null;

		if (option.getPurchasables) {
			purchasables = option.getPurchasables();
		}

		let amount = 0;

		if (purchasables && purchasables.length > 0) {
			amount = purchasables[0].amount;
		}

		return (
			<EnrollmentCard
				title={OptionText.getContentFor(option, TITLE)}
				description={OptionText.getContentFor(option, DESCRIPTION)}
				postTitleCmp={
					<div className="dot-suffix">
						<span className="value">${amount}</span>
					</div>
				}
				className="store"
				{...this.props}
			/>
		);
	}
}
