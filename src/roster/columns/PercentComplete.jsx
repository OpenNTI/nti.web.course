import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Logger from '@nti/util-logger';

import styles from './PercentComplete.css';

const logger = Logger.get('roster.component.percent-complete');
const cx = classnames.bind(styles);

function clamp(p) {
	if (p < 0 || p > 1) {
		logger.warn(
			`Expected a fractional value between 0 and 1. Received ${p}. Clamping to stay in range.`
		);
		return Math.min(Math.max(0, p), 1);
	}
	return p;
}

export default function PercentComplete({ className, percentage: p = 0 }) {
	const percentage = clamp(p);
	const progressAsInt = global.parseInt(percentage * 100);
	const positive = percentage > 0;
	const radius = 15.9155; // circumference = 100; aligns dash-array values with percentages
	const strokeWidth = 2;
	const size = Math.ceil((radius + strokeWidth) * 2);
	const strokeDasharray = `${progressAsInt} ${100 - progressAsInt}`;
	const strokeDashoffset = 25; // shift so zero is at 12 o'clock

	const props = {
		cx: '50%',
		cy: '50%',
		r: radius,
		strokeWidth,
		strokeDashoffset,
		fill: 'none',
		stroke: '#eee',
	};

	const completedProps = {
		...props,
		strokeDasharray,
		stroke: '#3fb34f',
	};

	return (
		<div
			className={cx(
				'percent-complete-container',
				{ positive },
				className
			)}
			data-progress-percent={percentage}
		>
			<svg width="25" height="25" viewBox={`0 0 ${size} ${size}`}>
				<circle {...props} />
				{positive && <circle {...completedProps} />}
			</svg>
			<span className={cx('text')}>{progressAsInt}%</span>
		</div>
	);
}

PercentComplete.propTypes = {
	percentage: PropTypes.number.isRequired,
};
