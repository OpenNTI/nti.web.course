import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { Text } from '@nti/web-commons';

import Styles from './Description.css';

const cx = classnames.bind(Styles);

CourseInfoSectionDescription.propTypes = {
	className: PropTypes.string,
};
export default function CourseInfoSectionDescription({
	className,
	...otherProps
}) {
	return (
		<Text.Base
			className={cx('course-info-description', className)}
			{...otherProps}
		/>
	);
}
