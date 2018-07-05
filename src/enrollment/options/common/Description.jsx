import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import PaddedContainer from './PaddedContainer';

CourseEnrollmentDescription.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node
};
export default function CourseEnrollmentDescription ({className, children, ...otherProps}) {
	const child = React.Children.toArray(children);
	let extraProps = {};

	if (child.length === 1 && typeof child[0] === 'string') {
		extraProps.dangerouslySetInnerHTML = {__html: child[0]};
	} else {
		extraProps.children = children;
	}

	return (
		<PaddedContainer
			className={cx('nti-course-enrollment-description', className)}
			{...extraProps}
			{...otherProps}
		/>
	);
}
