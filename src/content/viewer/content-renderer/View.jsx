import React from 'react';
import PropTypes from 'prop-types';

import {getCmpFor, TYPES} from './types';

export default class ContentViewer extends React.Component {
	static ContentTypes = TYPES

	static propTypes = {
		overrides: PropTypes.shape({
			getItemFor: PropTypes.func
		})
	}

	render () {
		const {overrides, ...otherProps} = this.props;
		const Cmp = getCmpFor(overrides, otherProps);

		if (!Cmp) { return null; }

		return (
			<Cmp {...otherProps} />
		);
	}
}
