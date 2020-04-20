import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Currency, Text} from '@nti/web-commons';

import Styles from './Styles.css';
import Content from './Content';
import {getPrice} from './utils';

const cx = classnames.bind(Styles);
const t = scoped('course.info.inline.components.pricing.View', {
	free: 'Free'
});


CoursePricing.propTypes = {
	catalogEntry: PropTypes.object
};
export default function CoursePricing ({catalogEntry}) {
	const price = getPrice(catalogEntry);
	const amount = price?.amount;
	const currency = price?.currency;

	return (
		<Content>
			<div className={cx('display')}>
				{!amount ?
					(<Text.Base className={cx('free')}>{t('free')}</Text.Base>) :
					(<Text.Base className={cx('price')}>{Currency.format(amount / 100, true, 'en-US', currency || 'USD')}</Text.Base>)
				}
			</div>
		</Content>
	);
}