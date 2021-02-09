import './Dialog.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {decorate} from '@nti/lib-commons';
import {scoped} from '@nti/lib-locale';
import {Prompt, Panels} from '@nti/web-commons';

import ManageCreditTypes from './ManageCreditTypes';
import Store from './CreditTypesStore';

const t = scoped('course.info.inline.components.transcriptcredit.managetypes.Dialog', {
	title: 'Manage Credit Types',
	done: 'Save',
});

class ManageCreditTypesDialog extends React.Component {
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
		store: PropTypes.object.isRequired,
		onClose: PropTypes.func,
		onSave: PropTypes.func,
		onDismiss: PropTypes.func,
		dialog: PropTypes.bool
	}

	state = {}


	onSave = async () => {
		const {onSave, onDismiss, store} = this.props;

		this.setState({loading: true});

		await store.removeValues(this.state.flaggedForRemoval);

		await store.saveValues(this.state.values);

		await store.loadAllTypes();

		if(onSave) {
			onSave();

			if (onDismiss) {
				onDismiss();
			}
		}

		// so the loading bar doesn't just flash for a split second
		setTimeout(() => { this.setState({loading: false}); }, 400);
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
		return (
			<div className="manage-credit-types-dialog">
				{this.props.dialog && (
					<div className="title">
						<Panels.TitleBar title={t('title')} iconAction={this.onDismiss} />
					</div>
				)}
				<div className="content">
					<ManageCreditTypes store={this.props.store} onValuesUpdated={this.onValuesUpdated}/>
				</div>
			</div>
		);
	}
}

export default decorate(ManageCreditTypesDialog, [
	Store.connect({
		loading: 'loading',
		types: 'types',
		error: 'error'
	})
]);
