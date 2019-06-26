import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './SubTitle.css';

const cx = classnames.bind(Styles);

SubTitle.propTypes = {
	className: PropTypes.string,
	blue: PropTypes.bool,
	dark: PropTypes.bool
};
export default function SubTitle ({className, blue, dark, ...otherProps}) {
	return (
		<span className={cx('scorm-collection-sub-title', className, {blue, dark})} {...otherProps} />
	);
}