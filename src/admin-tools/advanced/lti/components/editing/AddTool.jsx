import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Base from './Base';

export default class AddTool extends Component {
	static propTypes  = {
		onBeforeDismiss: PropTypes.func.isRequired
	}

	onSubmit = async (item) => {
		const { onBeforeDismiss, course } = this.props;

		try {
			await course.postToLink('lti-configured-tools', item);
			onBeforeDismiss();
		} catch (error) {
			this.setState({ error });
		}
	}

	render () {
		const { onBeforeDismiss } = this.props;
		return (
			<Base onSubmit={this.onSubmit} title="Add Tool" onBeforeDismiss={onBeforeDismiss} />
		);
	}

}
