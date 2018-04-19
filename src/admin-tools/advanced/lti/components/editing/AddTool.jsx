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

	onSubmit = async (item) => {
		const { onBeforeDismiss } = this.props;
		const store = Store.getInstance();

		const successful = await store.addItem(item);

		if (successful) {
			onBeforeDismiss();
		}
	}

	render () {
		const { onBeforeDismiss } = this.props;
		return (
			<Base onSubmit={this.onSubmit} title={t('title')} onBeforeDismiss={onBeforeDismiss} />
		);
	}

}
