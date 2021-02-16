import './PaddedContainer.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

PaddedContainer.propTypes = {
	className: PropTypes.string,
};
export default function PaddedContainer({ className, ...otherProps }) {
	return (
		<div
			className={cx('nti-course-enrollment-padded-container', className)}
			{...otherProps}
		/>
	);
}
