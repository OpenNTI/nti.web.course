import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'nti-web-commons';

import PackageWizard from './package-wizard';

const { Dialog } = Prompt;

class Editor extends Component {
	static propTypes = {
		onDismiss: PropTypes.func.isRequired,
		importLink: PropTypes.string.isRequired,
		bundle: PropTypes.object
	}

	render () {
		const { onDismiss } = this.props;

		return(
			<Dialog>
				<PackageWizard onDismiss={onDismiss} bundle={this.props.bundle} />
			</Dialog>
		);
	}
}

export default Editor;
