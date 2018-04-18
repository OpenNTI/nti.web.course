import React from 'react';
import PropTypes from 'prop-types';
import {rawContent} from '@nti/lib-commons';

TextPart.propTypes = { children: PropTypes.node };
export default function TextPart ({children, ...props}) {
	const [child = null] = React.Children.toArray(children);
	return typeof child !== 'string' ? (
		<div {...props}>{child}</div>
	) : (
		<div {...props} {...rawContent(child)}/>
	);
}
