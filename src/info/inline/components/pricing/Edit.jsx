import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Input, Errors, Radio, Text} from '@nti/web-commons';

import Styles from './Styles.css';
import Content from './Content';
import {getPrice} from './utils';

const cx = classnames.bind(Styles);
const t = scoped('course.info.inline.components.pricing.View', {
	free: 'Free',
	oneTime: 'One-Time Purchase'
});

const RadioGroup = 'course-pricing';

const Free = 'free';
const OneTime = 'one-time';

const MaxPrice = 99999999;//999,999.99 comes from stripe (https://stripe.com/docs/currencies#minimum-and-maximum-charge-amounts)

CoursePriceEditor.propTypes = {
	catalogEntry: PropTypes.object,
	onValueChange: PropTypes.func,
	error: PropTypes.any
};
export default function CoursePriceEditor ({catalogEntry, onValueChange, error}) {
	const [amount, setAmount] = React.useState(null);
	const [selectedOption, setSelectedOption] = React.useState(null);
	const [currency, setCurrency] = React.useState('USD');

	React.useEffect(() => {
		const price = getPrice(catalogEntry);

		setAmount(price?.amount);
		setCurrency(price?.currency ?? 'USD');

		setSelectedOption(price?.amount ? OneTime : Free);
	}, [catalogEntry]);

	const onChange = (newAmount, newCurrency) => {
		setAmount(newAmount);
		onValueChange?.('price', {amount: newAmount, currency: newCurrency});
	};

	const selectFree = () => {
		setSelectedOption(Free);
		onValueChange?.('price', null);
	};

	const selectOneTime = () => {
		setSelectedOption(OneTime);
		onValueChange?.('price', {amount, currency});
	};

	const extra = (
		<div className={cx('course-price-options')}>
			<Radio checked={selectedOption === Free} label={t('free')} name={RadioGroup} onChange={selectFree} />
			<Radio checked={selectedOption === OneTime} label={t('oneTime')} name={RadioGroup} onChange={selectOneTime} />
		</div>
	);

	return (
		<Content extra={extra} >
			<div className={cx('edit')}>
				{selectedOption === Free && (<Text.Base className={cx('free')}>{t('free')}</Text.Base>)}
				{selectedOption === OneTime && (
					<Input.Currency
						className={cx('course-price-input')}
						amount={amount}
						max={MaxPrice}
						currency={currency}
						onChange={onChange}
						omitFractional
					/>
				)}
				<Errors.Message className={cx('course-price-error')} error={error} />
			</div>
		</Content>
	);
}