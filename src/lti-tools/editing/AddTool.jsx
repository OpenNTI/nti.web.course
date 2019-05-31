import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

import Base from './Base';


const DEFAULT_TEXT = {
	title: 'Add Tool',
};

const t = scoped('nti-web-course.admin-tools.advanced.lti.editing.AddTool', DEFAULT_TEXT);

export default class AddTool extends Component {
	static propTypes  = {
		store: PropTypes.object.isRequired,
		onBeforeDismiss: PropTypes.func.isRequired,
		modal: PropTypes.bool
	}

	state = {
		loading: false,
		error: null
	}

	onSubmit = (item) => {
		const { onBeforeDismiss, store, modal } = this.props;

		this.setState({ loading: true });

		store.addItem(item)
			.then(x => {
				this.setState({ loading: false });
				onBeforeDismiss(item);
				if (!modal) {
					store.loadItems();
				}
			})
			.catch(error => {
				const msg = 'There was an error with creating the tool.';
				if (error.statusCode === 422) {
					this.setState({ error: error.Message || error.suberrors[0].message, loading: false });
				} else {
					this.setState({ error: msg, loading: false });
				}
			});
	}

	render () {
		const { onBeforeDismiss, modal } = this.props;
		const { loading, error } = this.state;

		return (
			<Base onSubmit={this.onSubmit} title={t('title')} onBeforeDismiss={onBeforeDismiss} loading={loading} error={error} modal={modal} />
		);
	}

}
