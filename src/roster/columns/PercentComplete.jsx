import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './PercentComplete.css';

const cx = classnames.bind(styles);

export default function PercentComplete ({className, percentage = 0}) {

	const progressAsInt = global.parseInt(percentage * 100);
	const positive = percentage > 0;

	return (
		<div className={cx('percent-complete-container', {positive}, className)} data-progress-percent={percentage}>
			<svg width="25" height="25" viewBox="0 0 36 36">
				<path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="2" strokeDasharray="100, 100" />
				<path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3FB34F" strokeWidth="2" strokeDasharray={`${progressAsInt}, 100`}/>
			</svg>
			<span className={cx('text')}>{progressAsInt}%</span>
		</div>
	);
}

PercentComplete.propTypes = {
	percentage: PropTypes.number.isRequired
};

