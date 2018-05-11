import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Prompt, Input, DialogButtons, Panels} from '@nti/web-commons';

const t = scoped('course.info.inline.components.transcriptcredit.AddCreditType', {
	addNewType: 'Add New Type...',
	title: 'Add New Credit Type',
	done: 'Save',
	alreadyExists: 'This credit type already exists'
});

export default class AddCreditType extends React.Component {
	static show (existingTypes) {
		return new Promise((fulfill, reject) => {
			Prompt.modal(
				<AddCreditType
					existingTypes={existingTypes}
					onSave={fulfill}
					onCancel={reject}
				/>,
				'add-credit-type-container'
			);
		});
	}

	static propTypes = {
		existingTypes: PropTypes.arrayOf(PropTypes.object),
		onSave: PropTypes.func,
		onDismiss: PropTypes.func
	}


	state = {}

	onSave = () => {
		const {onDismiss} = this.props;
		const {unit, type} = this.state;
		const combined = type + ' ' + unit;
		const exists = (this.props.existingTypes || []).map(x => x.type.toLowerCase() + ' ' + x.unit.toLowerCase()).filter(x => x === combined.toLowerCase());

		if(exists.length > 0) {
			this.setState({error: t('alreadyExists')});
		}
		else
		{
			if(this.props.onSave) {
				this.props.onSave({type, unit});

				if (onDismiss) {
					onDismiss();
				}
			}
		}
	}

	onDismiss = () => {
		const {onDismiss} = this.props;

		if (onDismiss) {
			onDismiss();
		}
	}

	onUnitChange = (value) => {
		this.setState({unit: value});
	}

	onTypeChange = (value) => {
		this.setState({type: value});
	}

	render () {
		const {type, unit, error} = this.state;

		const buttons = [
			{label: t('done'), onClick: this.onSave}
		];

		return (
			<div className="add-credit-type">
				<div className="title">
					<Panels.TitleBar title={t('title')} iconAction={this.onDismiss} />
				</div>
				<div className="content">
					{error && <div className="error">{error}</div>}
					<div className="header-row">
						<div className="header-text">Type</div>
						<div className="header-text">Unit</div>
					</div>
					<Input.Text value={type} className="type" onChange={this.onTypeChange}/>
					<Input.Text value={unit} className="unit" onChange={this.onUnitChange}/>
				</div>
				<DialogButtons buttons={buttons} />
			</div>
		);
	}
}
