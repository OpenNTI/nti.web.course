import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Prompt, DialogButtons, Panels} from '@nti/web-commons';

import ManageCreditTypes from './ManageCreditTypes';
import Store from './CreditTypesStore';

const t = scoped('course.info.inline.components.transcriptcredit.managetypes.Dialog', {
	title: 'Manage Credit Types',
	done: 'Save',
});

export default class ManageCreditTypesDialog extends React.Component {
	static show (onClose) {
		return new Promise((fulfill, reject) => {
			Prompt.modal(
				<ManageCreditTypesDialog
					dialog
					onClose={onClose}
					onSave={fulfill}
					onCancel={reject}
				/>,
				'manage-credit-types-container'
			);
		});
	}

	static propTypes = {
		onClose: PropTypes.func,
		onSave: PropTypes.func,
		onDismiss: PropTypes.func,
		dialog: PropTypes.bool
	}

	constructor (props) {
		super(props);

		this.store = Store.getInstance();
	}


	state = {}


	onSave = async () => {
		const {onSave, onDismiss} = this.props;

		await this.store.saveValues(this.state.values);

		await this.store.removeValues(this.state.flaggedForRemoval);

		if(onSave) {
			onSave();

			if (onDismiss) {
				onDismiss();
			}
		}
	}

	onDismiss = () => {
		const {onDismiss} = this.props;

		if (onDismiss) {
			onDismiss();
		}
	}

	onValuesUpdated = (newValues, flaggedForRemoval) => {
		this.setState({values: newValues, flaggedForRemoval});
	}


	render () {
		const buttons = [
			{label: t('done'), onClick: this.onSave}
		];

		return (
			<div className="manage-credit-types-dialog">
				{this.props.dialog && (
					<div className="title">
						<Panels.TitleBar title={t('title')} iconAction={this.onDismiss} />
					</div>
				)}
				<div className="content">
					<ManageCreditTypes onValuesUpdated={this.onValuesUpdated}/>
				</div>
				<DialogButtons buttons={buttons} />
			</div>
		);
	}
}
