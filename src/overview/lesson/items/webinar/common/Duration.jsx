import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './Duration.css';

const cx = classnames.bind(styles);

function getDuration (startTime, endTime) {
	return (startTime == null || endTime == null)
		? 0
		: Math.max(endTime - startTime, 0);
}

Duration.propTypes = {
	startTime: PropTypes.object, // Date
	endTime: PropTypes.object, // Date
	longAbbreviations: PropTypes.bool
};

export default function Duration ({startTime, endTime, longAbbreviations, className}) {
	const rawDuration = getDuration(startTime, endTime);
	const hours = Math.floor((rawDuration / 1000) / 60 / 60);
	const minutes = ((rawDuration) - (hours * 60 * 60 * 1000)) / 1000 / 60;

	let hourShort = longAbbreviations ? 'hr' : 'h';
	let minuteShort = longAbbreviations ? 'min' : 'm';

	return (
		<span className={cx('duration', className)}>
			{hours > 0 && <span className={cx('hours')}>{hours}{hourShort}</span>}
			{minutes > 0 && <span className={cx('minutes', {solo: hours === 0})}>{minutes}{minuteShort}</span>}
		</span>
	);
}
