import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Flyout, HOC } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import EditTool from '../editing/EditTool';

const DEFAULT_TEXT = {
	edit: 'Edit',
	delete: 'Delete',
};

const t = scoped('nti-web-course.admin-tools.advanced.lti.tools.Tool', DEFAULT_TEXT);

export default class Tool extends Component {
	static propTypes = {
		store: PropTypes.object.isRequired,
		item: PropTypes.shape({
			title: PropTypes.string.isRequired,
			delete: PropTypes.func.isRequired
		}).isRequired
	}

	state = {
		showEditor: false
	}

	attachFlyoutRef = x => this.flyout = x;

	hideEditor = () => {
		this.setState({ showEditor: false });
	}

	onShowEditor = () => {
		if (this.flyout) {
			this.flyout.dismiss();
		}

		this.setState({ showEditor: true });
	}

	delete = () => {
		const {store} = this.props;
		store.deleteItem(this.props.item);
	}

	onItemChange = () => {
		const {store} = this.props;
		store.itemChange(this.props.item);
	}

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
					<div className="lti-configured-tool-edit" onClick={this.onShowEditor}>
						<i className="icon-edit" />
						{t('edit')}
					</div>
					<div className="lti-configured-tool-delete" onClick={this.delete}>
						<i className="icon-delete" />
						{t('delete')}
					</div>
				</React.Fragment>
			</Flyout.Triggered>
		);
	}

	render () {
		const { item } = this.props;
		const { showEditor } = this.state;

		return (
			<HOC.ItemChanges item={item} onItemChanged={this.onItemChange}>
				<li className="lti-configured-tool">
					<div className="lti-tool-title">{item.title}</div>
					{this.renderOptions()}
					{showEditor && <EditTool item={item} onBeforeDismiss={this.hideEditor} />}
				</li>
			</HOC.ItemChanges>
		);
	}
}
