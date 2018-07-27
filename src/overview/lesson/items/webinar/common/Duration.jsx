import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

WebinarDuration.propTypes = {
	webinar: PropTypes.object.isRequired,
	longAbbreviations: PropTypes.bool
};
export default function WebinarDuration ({webinar, longAbbreviations}) {
	const rawDuration = webinar.getDuration();
	const hours = Math.floor((rawDuration / 1000) / 60 / 60);
	const minutes = ((rawDuration) - (hours * 60 * 60 * 1000)) / 1000 / 60;
	const duration = {hours, minutes};

	let hourShort = longAbbreviations ? 'hr' : 'h';
	let minuteShort = longAbbreviations ? 'min' : 'm';

	return (
		<span className="webinar-duration">
			{duration.hours > 0 && <span className="hour">{duration.hours}{hourShort}</span>}
			{duration.minutes > 0 && <span className={cx('minutes', {solo: duration.hours === 0})}>{duration.minutes}{minuteShort}</span>}
		</span>
	);
}
