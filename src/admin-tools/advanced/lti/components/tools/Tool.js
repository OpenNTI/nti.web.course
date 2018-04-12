import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Flyout } from 'nti-web-commons';

import EditTool from '../editing/EditTool';

export default class Tool extends Component {
	static propTypes = {
		item: PropTypes.shape({
			title: PropTypes.string.isRequired
		}).isRequired
	}

	state = {
		showEditor: false
	}

	attachFlyoutRef = x => this.flyout = x

	renderOptions = () => {
		const trigger = (
			<div className="lti-cofingured-tool-preview">
				<i className="icon-settings" />
			</div>
		);

		return (
			<Flyout.Triggered
				className="lti-configured-tool-options"
				trigger={trigger}
				ref={this.attachFlyoutRef}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			>
				<React.Fragment>
					<div className="lti-configured-tool-edit" onClick={this.showEditor}>
						<i className="icon-edit" />
						Edit
					</div>
					<div className="lti-configured-tool-delete">
						<i className="icon-delete" />
						Delete
					</div>
				</React.Fragment>
			</Flyout.Triggered>
		);
	}

	hideEditor = () => {
		this.setState({ showEditor: false });
	}

	showEditor = () => {
		this.setState({ showEditor: true });
	}

	render () {
		const { item } = this.props;
		const { showEditor } = this.state;

		return (
			<li className="lti-configured-tool">
				<div className="lti-tool-title">{item.title}</div>
				{this.renderOptions()}
				{showEditor && <EditTool item={item} onBeforeDismiss={this.hideEditor} />}
			</li>
		);
	}
}
