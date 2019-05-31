import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from '@nti/web-commons';

const { Dialog } = Prompt;

import Content from './Content';

export default
class Base extends Component {
	static propTypes = {
		onBeforeDismiss: PropTypes.func.isRequired,
		title: PropTypes.string.isRequired,
		onSubmit: PropTypes.func.isRequired,
		submitLabel: PropTypes.string.isRequired,
		error: PropTypes.string,
		loading: PropTypes.bool,
		item: PropTypes.object,
		modal: PropTypes.bool,
	}

	render () {
		const { item, title, error, loading, onSubmit, onBeforeDismiss, submitLabel = 'Create', modal } = this.props;

		const content = (
			<Content
				item={item}
				onBeforeDismiss={onBeforeDismiss}
				onSubmit={onSubmit}
				loading={loading}
				title={title}
				submitLabel={submitLabel}
				error={error}/>
		);
		return modal ?
			content : (<Dialog closeOnMaskClick onBeforeDismiss={onBeforeDismiss}>{content}</Dialog>);
	}
}
