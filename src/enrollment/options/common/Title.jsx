import './Title.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import PaddedContainer from './PaddedContainer';

CourseEnrollmentTitle.propTypes = {
	className: PropTypes.string
};
export default function CourseEnrollmentTitle ({className, ...otherProps}) {
	return (
		<PaddedContainer className={cx('nti-course-enrollment-title', className)} {...otherProps} />
	);
}