import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import PaddedContainer from './PaddedContainer';

CourseEnrollmentDescription.propTypes = {
	className: PropTypes.string
};
export default function CourseEnrollmentDescription ({className, ...otherProps}) {
	return (
		<PaddedContainer className={cx('nti-course-enrollment-description', className)} {...otherProps} />
	);
}