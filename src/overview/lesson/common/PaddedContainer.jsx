import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

LessonOverviewPaddedContainer.propTypes = {
	className: PropTypes.string,
	children: PropTypes.any
};
export default function LessonOverviewPaddedContainer ({children, className, ...otherProps}) {
	return (
		<div className={cx('lesson-overview-padded-container', className)} {...otherProps}>
			{children}
		</div>
	);
}
