import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

import EnrollmentCard from '../common/EnrollmentCard';

const t = scoped('course.info.inline.enrollment.options.StoreEnrollment', {
	title: 'Purchase',
	description: 'Store Enrollment',
	amount: 'Amount'
});

export default class StoreEnrollment extends React.Component {
	static propTypes = {
		option: PropTypes.object.isRequired,
		addable: PropTypes.bool,
		editable: PropTypes.bool,
		onItemActivate: PropTypes.func,
		onItemDeactivate: PropTypes.func
	}

	state = {}

	render () {
		const { Purchasables } = (this.props.option || {});

		let amount = 0;

		if(Purchasables && Purchasables.Items && Purchasables.Items.length > 0) {
			amount = Purchasables.Items[0].Amount;
		}

		return (
			<EnrollmentCard
				title={t('title')}
				description={t('description')}
				postTitleCmp={<div className="dot-suffix"><span className="value">${amount}</span></div>}
				className="store"
			/>
		);
	}
}
