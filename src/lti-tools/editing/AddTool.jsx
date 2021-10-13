import './AddTool.scss';
import { Component } from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import Base from './Base';

const DEFAULT_TEXT = {
	title: 'Add Tool',
	invalid: 'There was an error with creating the tool.',
};

const t = scoped('nti-web-course.lti-tools.editing.AddTool', DEFAULT_TEXT);

export default class AddTool extends Component {
	static propTypes = {
		store: PropTypes.object.isRequired,
		onBeforeDismiss: PropTypes.func.isRequired,
		modal: PropTypes.bool,
	};

	state = {
		loading: false,
		error: null,
	};

	onSubmit = async item => {
		const { onBeforeDismiss, store, modal } = this.props;

		this.setState({ loading: true });

		try {
			await store.addItem(item);

			this.setState({ loading: false });

			onBeforeDismiss(item);

			if (!modal) {
				store.loadItems();
			}
		} catch (error) {
			const msg = t('invalid');
			if (error.suberrors) {
				this.setState({ error: error.suberrors, loading: false });
			} else if (error.code && error.field && error.message) {
				this.setState({ error: [error], loading: false });
			} else {
				this.setState({
					error: error.Message || error.message || msg,
					loading: false,
				});
			}
		}
	};

	render() {
		const { onBeforeDismiss, modal } = this.props;
		const { loading, error } = this.state;

		return (
			<Base
				onSubmit={this.onSubmit}
				title={t('title')}
				onBeforeDismiss={onBeforeDismiss}
				loading={loading}
				error={error}
				modal={modal}
			/>
		);
	}
}
