import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from '@nti/web-commons';

import PackageWizard from './package-wizard';

const { Dialog } = Prompt;

class Editor extends Component {
	static propTypes = {
		onDismiss: PropTypes.func.isRequired,
		bundle: PropTypes.object,
		onFinish: PropTypes.func.isRequired
	}

	render () {
		const { onDismiss, onFinish } = this.props;

		return(
			<Dialog>
				<PackageWizard onDismiss={onDismiss} onCancel={onDismiss} onFinish={onFinish} bundle={this.props.bundle} />
			</Dialog>
		);
	}
}

export default Editor;
