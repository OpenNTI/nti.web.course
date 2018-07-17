import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

import Store from '../../Store';

import Base from './Base';

const DEFAULT_TEXT = {
	title: 'Add Tool',
};

const t = scoped('nti-web-course.admin-tools.advanced.lti.editing.AddTool', DEFAULT_TEXT);

export default class AddTool extends Component {
	static propTypes  = {
		onBeforeDismiss: PropTypes.func.isRequired
	}

	state = {
		loading: false,
		error: null
	}

	onSubmit = async (item) => {
		const { onBeforeDismiss } = this.props;

		this.setState({ loading: true });

		try {
			const store = Store.getInstance();
			const successful = await store.addItem(item);
			this.setState({ loading: false });

			if (successful) {
				onBeforeDismiss(item);
			}
		} catch (error) {
			this.setState({ error, loading: false });
		}
	}

	render () {
		const { onBeforeDismiss } = this.props;
		const { loading, error } = this.state;

		return (
			<Base onSubmit={this.onSubmit} title={t('title')} onBeforeDismiss={onBeforeDismiss} loading={loading} error={error} />
		);
	}

}
