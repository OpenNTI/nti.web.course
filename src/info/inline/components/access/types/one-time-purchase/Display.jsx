import React from 'react';
import PropTypes from 'prop-types';

import { Currency } from '@nti/web-commons';

import { getPrice } from '../utils';
import Free from '../free/Display';
import Label from '../../components/Label';

OneTimePurchaseDisplay.propTypes = {
	catalogEntry: PropTypes.object,
};
export default function OneTimePurchaseDisplay({ catalogEntry }) {
	const price = getPrice(catalogEntry);
	const amount = price?.amount;
	const currency = price?.current;

	return !amount ? (
		<Free />
	) : (
		<Label>
			{Currency.format(amount / 100, true, 'en-US', currency || 'USD')}
		</Label>
	);
}
