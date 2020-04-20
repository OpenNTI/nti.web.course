import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Input, Errors} from '@nti/web-commons';

import Styles from './Styles.css';
import Content from './Content';
import {getPrice} from './utils';

const cx = classnames.bind(Styles);

CoursePriceEditor.propTypes = {
	catalogEntry: PropTypes.object,
	onValueChange: PropTypes.func,
	error: PropTypes.any
};
export default function CoursePriceEditor ({catalogEntry, onValueChange, error}) {
	const [amount, setAmount] = React.useState(null);
	// const [currency, setCurrency] = React.useState(null);

	React.useEffect(() => {
		const price = getPrice(catalogEntry);

		setAmount(price?.amount);
		// setCurrency(price?.currency ?? 'USD');
	}, [catalogEntry]);

	const onChange = (newAmount, currency) => {
		debugger;
		setAmount(newAmount);

		if (onValueChange) {
			onValueChange('price', {amount: newAmount, currency});
		}
	};

	return (
		<Content>
			<Input.Currency
				className={cx('course-price-input')}
				amount={amount}
				currency="USD"
				onChange={onChange}
				omitFractional
			/>
			<Errors.Message error={error} />
		</Content>
	);
}