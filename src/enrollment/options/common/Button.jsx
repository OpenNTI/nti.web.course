import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

CourseEnrollmentOptiontsButton.propTypes = {
	className: PropTypes.string,
	caution: PropTypes.bool
};
export default function CourseEnrollmentOptiontsButton ({className, caution, ...otherProps}) {
	return (
		<div className={cx('nti-course-enrollment-option-button', className, {caution})} {...otherProps} />
	);
}
