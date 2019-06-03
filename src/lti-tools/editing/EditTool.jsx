import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

import Base from './Base';

const DEFAULT_TEXT = {
	title: 'Edit Tool',
	submitLabel: 'Save',
	invalid: 'There was an error with updating the tool.'
};

const t = scoped('nti-web-course.lti-tools.editing.EditTool', DEFAULT_TEXT);


export default class EditTool extends Component {
	static propTypes = {
		onBeforeDismiss: PropTypes.func.isRequired,
		item: PropTypes.object.isRequired
	}

	state = {
		error: null,
		loading: false
	}

	onSubmit = async (updatedItem) => {
		const { onBeforeDismiss, item } = this.props;
		this.setState({ loading: true });

		try {
			await item.save(updatedItem);

			this.setState({ loading: false });

			onBeforeDismiss();
		} catch (error) {
			const msg = t('invalid');
			if (error.suberrors) {
				this.setState({ error: error.suberrors, loading: false });
			} else if (error.code && error.field && error.message) {
				this.setState({ error: [error], loading: false});
			} else {
				this.setState({ error: error.Message || error.message || msg, loading: false });
			}
		}
	}

	render () {
		const { onBeforeDismiss, item } = this.props;
		const { error, loading } = this.state;

		return (
			<Base item={item} onSubmit={this.onSubmit} title={t('title')} onBeforeDismiss={onBeforeDismiss} submitLabel={t('submitLabel')} error={error} loading={loading} />
		);
	}

}
