import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scoped } from 'nti-lib-locale';

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
		error: null
	}

	onSubmit = async (item) => {
		const { onBeforeDismiss } = this.props;
		const store = Store.getInstance();
		try {
			store.addItem(item);
			onBeforeDismiss();
		} catch (error) {
			this.setState({ error });
		}
	}

	render () {
		const { onBeforeDismiss } = this.props;
		const { error } = this.state;
		return (
			<Base onSubmit={this.onSubmit} title={t('title')} onBeforeDismiss={onBeforeDismiss} error={error} />
		);
	}

}
