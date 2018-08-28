import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import PaddedContainer from './PaddedContainer';

CourseEnrollmentOptionsActionItem.propTypes = {
	className: PropTypes.string
};
export default function CourseEnrollmentOptionsActionItem ({className, ...otherProps}) {
	return (

		<PaddedContainer
			className={cx('course-enrollment-options-action-item', className)}
			{...otherProps}
		/>
	);
}
