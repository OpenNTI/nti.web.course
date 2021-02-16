import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './SubTitle.css';

const cx = classnames.bind(Styles);

SubTitle.propTypes = {
	className: PropTypes.string,
	blue: PropTypes.bool,
	dark: PropTypes.bool,
	white: PropTypes.bool,
	green: PropTypes.bool,
};
export default function SubTitle({
	className,
	blue,
	dark,
	white,
	green,
	...otherProps
}) {
	return (
		<span
			className={cx('scorm-collection-sub-title', className, {
				blue,
				dark,
				white,
				green,
			})}
			{...otherProps}
		/>
	);
}
