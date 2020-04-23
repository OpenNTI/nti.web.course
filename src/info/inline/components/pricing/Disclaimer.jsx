import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

PricingDisclaimer.propTypes = {
	children: PropTypes.any
};
export default function PricingDisclaimer ({children}) {
	return (
		<div className={cx('pricing-disclaimer')}>
			<i className={cx('icon-alert')}/>
			{children}
		</div>
	);
}