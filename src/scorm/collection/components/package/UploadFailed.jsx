import React from 'react';
import PropTypes from 'prop-types';

import Failed from './Failed';

export default class UploadedFailedPackage extends React.Component {
	static propTypes = {
		package: PropTypes.object,
		deletePackage: PropTypes.func,
	};

	state = {};

	componentDidMount() {
		this.setup();
	}

	componentDidUpdate(prevProps) {
		const { package: pack } = this.props;
		const { package: oldPack } = prevProps;

		if (pack !== oldPack) {
			this.setup();
		}
	}

	async setup() {
		const { package: pack } = this.props;

		try {
			await pack;
		} catch (e) {
			this.setState({
				error: e,
			});
		}
	}

	render() {
		const { error } = this.state;

		if (!error) {
			return null;
		}

		return <Failed {...this.props} error={error} />;
	}
}
