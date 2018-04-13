import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Base from './Base';

export default class EditTool extends Component {
	static propTypes = {
		onBeforeDismiss: PropTypes.func.isRequired,
		item: PropTypes.object.isRequired
	}

	onSubmit = async (item) => {
		// const { onBeforeDismiss, course } = this.props;
		// TODO: Add on submit
	}

	render () {
		const { onBeforeDismiss, item } = this.props;
		return (
			<Base item={item} onSubmit={this.onSubmit} title="Edit Tool" onBeforeDismiss={onBeforeDismiss} submitLabel="Save" />
		);
	}

}
