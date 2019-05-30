import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from '@nti/web-commons';

const { Dialog } = Prompt;

import Store from '../../Store';

import { LTIContent } from './../../../../../lti-tools';

const propMap = {
	'editing-error': 'error',
};

export default
@Store.connect(propMap)
class Base extends Component {
	static propTypes = {
		onBeforeDismiss: PropTypes.func.isRequired,
		title: PropTypes.string.isRequired,
		onSubmit: PropTypes.func.isRequired,
		submitLabel: PropTypes.string.isRequired,
		error: PropTypes.string,
		store: PropTypes.object,
		loading: PropTypes.bool,
		item: PropTypes.object
	}

	onBeforeDismiss = () => {
		const { store, onBeforeDismiss } = this.props;
		store.clearError();
		onBeforeDismiss();
	}

	render () {
		const { item, title, error, loading, onSubmit, submitLabel = 'Create' } = this.props;

		return (
			<Dialog closeOnMaskClick onBeforeDismiss={this.onBeforeDismiss}>
				<LTIContent
					item={item}
					onBeforeDismiss={this.onBeforeDismiss}
					onSubmit={onSubmit}
					loading={loading}
					title={title}
					submitLabel={submitLabel}
					error={error}/>
			</Dialog>
		);
	}
}
