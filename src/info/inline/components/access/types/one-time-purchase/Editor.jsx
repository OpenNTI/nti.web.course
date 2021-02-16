import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '@nti/web-commons';

import { getPrice } from '../utils';

const MaxPrice = 99999999; //999,999.99 comes from stripe (https://stripe.com/docs/currencies#minimum-and-maximum-charge-amounts)

OneTimePurchaseEditor.propTypes = {
	catalogEntry: PropTypes.object,
	onChange: PropTypes.func,
};
export default function OneTimePurchaseEditor({
	catalogEntry,
	onChange: onChangeProp,
}) {
	const [amount, setAmount] = React.useState(null);
	const [currency, setCurrency] = React.useState('USD');

	React.useEffect(() => {
		const price = getPrice(catalogEntry);

		setAmount(price?.amount);
		setCurrency(price?.currency ?? 'USD');

		onChangeProp?.({
			price: {
				amount: price?.amount,
				currency: price?.currency ?? 'USD',
			},
		});
	}, [catalogEntry]);

	const onChange = (newAmount, newCurrency) => {
		setAmount(newAmount);
		onChangeProp?.({ price: { amount: newAmount, currency: newCurrency } });
	};

	return (
		<Input.Currency
			amount={amount}
			max={MaxPrice}
			currency={currency}
			onChange={onChange}
			omitFractional
		/>
	);
}
