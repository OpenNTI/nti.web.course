import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Title.css';

const cx = classnames.bind(Styles);

Title.propTypes = {
	className: PropTypes.string,
	white: PropTypes.bool,
};
export default function Title({ className, white, ...otherProps }) {
	return (
		<span
			className={cx('scorm-collection-title', className, { white })}
			{...otherProps}
		/>
	);
}
