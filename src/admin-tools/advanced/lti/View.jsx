import React, { Component } from 'react';
import { Button } from 'nti-web-commons';
import PropTypes from 'prop-types';

import AddTool from './components/editing/AddTool';
import ToolList from './components/tools/ToolList';

export default class LTITools extends Component {
	static propTypes = {
		course: PropTypes.object.isRequired
	}

	state = {
		addIsVisible: false
	}

	onAddTool = () => {
		this.setState({ addIsVisible: true });
	}

	onAddDismiss = () => {
		this.setState({ addIsVisible: false });
	}

	render () {
		const { addIsVisible } = this.state;
		const { course } = this.props;

		return (
			<div className="lti-tools-config">
				<div className="lti-tools-config-headerBar">
					<div className="lti-tools-config-header">LTI Tool Configuration</div>
					<Button className="lti-tools-add" onClick={this.onAddTool}>Add Tool</Button>
				</div>
				<ToolList course={course} />
				{addIsVisible && <AddTool onBeforeDismiss={this.onAddDismiss} course={course} />}
			</div>
		);
	}
}
