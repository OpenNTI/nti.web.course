import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './PaddedContainer.css';

const cx = classnames.bind(Styles);

SCORMCollectionPaddedContainer.propTypes = {
	className: PropTypes.string
};
export default function SCORMCollectionPaddedContainer ({className, ...otherProps}) {
	return (
		<div className={cx('scorm-padded-container', className)} {...otherProps} />
	);
}