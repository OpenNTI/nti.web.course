import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scoped } from 'nti-lib-locale';

import Base from './Base';

const DEFAULT_TEXT = {
	title: 'Edit Tool',
	submitLabel: 'Save',
};

const t = scoped('nti-web-course.admin-tools.advanced.lti.editing.EditTool', DEFAULT_TEXT);

export default class EditTool extends Component {
	static propTypes = {
		onBeforeDismiss: PropTypes.func.isRequired,
		item: PropTypes.object.isRequired
	}

	state = {
		error: null
	}

	onSubmit = async (updatedItem) => {
		const { onBeforeDismiss, item } = this.props;

		try {
			await item.save(updatedItem);
		} catch (error) {
			this.setState({ error });
		}

		onBeforeDismiss();
	}

	render () {
		const { onBeforeDismiss, item } = this.props;
		const { error } = this.state;
		return (
			<Base item={item} onSubmit={this.onSubmit} title={t('title')} onBeforeDismiss={onBeforeDismiss} submitLabel={t('submitLabel')} error={error} />
		);
	}

}
