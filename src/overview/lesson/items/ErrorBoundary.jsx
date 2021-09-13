import React from 'react';

import { Error } from '@nti/web-commons';
import { reportError } from '@nti/web-client';

export class ErrorBoundary extends React.Component {
	state = {};

	componentDidCatch(error) {
		reportError(error);
		this.setState({ error });
	}

	render() {
		const { error } = this.state;
		return error ? (
			<Error error={error} inline>
				{this.props.render?.({ ...this.props, error })}
			</Error>
		) : (
			this.props.children
		);
	}
}
