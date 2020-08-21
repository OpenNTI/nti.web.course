import './Badge.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

CourseCardBadge.propTypes = {
	className: PropTypes.string,
	green: PropTypes.bool,
	blue: PropTypes.bool,
	grey: PropTypes.bool,
	black: PropTypes.bool,
	orange: PropTypes.bool,
	white: PropTypes.bool,
	settings: PropTypes.bool
};
export default function CourseCardBadge ({className, green, blue, grey, black, orange, white, settings, ...otherProps}) {
	return (
		<div className={cx('nti-course-card-badge', className, {green, blue, grey, black, orange, white, settings})} {...otherProps} />
	);
}
