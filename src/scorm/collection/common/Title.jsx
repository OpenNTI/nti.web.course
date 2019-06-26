import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Title.css';

const cx = classnames.bind(Styles);

Title.propTypes = {
	className: PropTypes.string
};
export default function Title ({className, ...otherProps}) {
	return (
		<span className={cx('scorm-collection-title', className)} {...otherProps} />
	);
}