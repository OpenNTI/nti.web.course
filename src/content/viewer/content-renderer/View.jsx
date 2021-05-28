import React from 'react';
import PropTypes from 'prop-types';

import { resolveComponent, TYPES } from './types';

export default class ContentViewer extends React.Component {
	static ContentTypes = TYPES;

	static propTypes = {
		overrides: PropTypes.shape({
			getItemFor: PropTypes.func,
		}),
	};

	render() {
		const { overrides, ...otherProps } = this.props;
		const Cmp = resolveComponent(overrides, otherProps);

		if (!Cmp) {
			return null;
		}

		return <Cmp {...otherProps} />;
	}
}
