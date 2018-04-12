import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Tool from './Tool';

export default class ToolList extends Component {
	static propTypes = {
		course: PropTypes.shape({
			getLTIConfiguredTools: PropTypes.func.isRequired
		}).isRequired
	}

	state = {
		tools: []
	}

	async componentDidMount () {
		const { course } = this.props;
		const tools = await course.getLTIConfiguredTools();
		this.setState({ tools });
	}


	render () {
		const { tools } = this.state;

		return (
			<div className="lti-tool-list">
				<ul className="lti-configured-tools">
					{tools.map(tool => <Tool key={tool.getID()} item={tool} /> )}
				</ul>
			</div>
		);
	}
}
