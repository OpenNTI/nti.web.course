import './Button.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

CourseEnrollmentOptionsButton.propTypes = {
	className: PropTypes.string,
	caution: PropTypes.bool,
	disabled: PropTypes.bool,
};
export default function CourseEnrollmentOptionsButton({
	className,
	caution,
	disabled,
	...otherProps
}) {
	return (
		<div
			className={cx('nti-course-enrollment-option-button', className, {
				caution,
				disabled,
			})}
			{...otherProps}
		/>
	);
}
