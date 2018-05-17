import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {Input, Flyout, RemoveButton} from '@nti/web-commons';
import {getService} from '@nti/web-client';

import AddCreditType from './AddCreditType';
import CreditEntryTypeOption from './CreditEntryTypeOption';


const t = scoped('course.info.inline.components.transcriptcredit.CreditEntry', {
	addNewType: 'Add New Type...'
});

const fixedDecimal = (n,d) => parseFloat(Math.round(n * 100) / 100).toFixed(d);

export default class TranscriptCreditEntry extends React.Component {
	static propTypes = {
		entry: PropTypes.object.isRequired,
		allTypes: PropTypes.arrayOf(PropTypes.object),
		remainingTypes: PropTypes.arrayOf(PropTypes.object),
		onRemove: PropTypes.func,
		onChange: PropTypes.func,
		onNewTypeAdded: PropTypes.func,
		removable: PropTypes.bool,
		editable: PropTypes.bool
	}

	attachFlyoutRef = x => this.flyout = x

	attachInputRef = x => this.input = x;

	state = {}

	componentDidMount () {
		getService().then(service => {
			const creditDefs = service.getCollection('CreditDefinitions', 'Global');

			this.setState({canAddTypes: creditDefs.accepts && creditDefs.accepts.length > 0});
		});
	}

	valueChanged = (val) => {
		const {onChange, entry} = this.props;

		this.setState({amount: val});

		const valid = this.input.validity;

		let error = null;

		if(valid.patternMismatch) {
			error = 'Must be a numeric value';
		}

		if(onChange) {
			const newEntry = {...entry, amount: val};

			onChange(newEntry, error);
		}
	}

	typeChanged = (val) => {
		const {onChange, entry} = this.props;

		this.setState({creditDefinition: val});

		if(onChange) {
			const newEntry = {...entry, creditDefinition: val};

			onChange(newEntry);
		}

		this.flyout.dismiss();
	}

	removeEntry = () => {
		const {onRemove, entry} = this.props;

		if(onRemove) {
			onRemove(entry);
		}
	}

	renderValue () {
		return <div className="credit-value">{fixedDecimal(this.props.entry.amount, 2)}</div>;
	}

	renderEditableValue () {
		return <Input.Text className="credit-value" maxLength="6" value={(this.props.entry.amount || '').toString()} onChange={this.valueChanged} pattern="[0-9]+([.,][0-9]+)?" ref={this.attachInputRef}/>;
	}

	renderType () {
		const {entry} = this.props;

		return <div className="credit-type">{this.getStringForType(entry.creditDefinition)}</div>;
	}


	renderTypeTrigger () {
		const {entry} = this.props;

		return <div className="credit-type-select">{this.getStringForType(entry.creditDefinition)}<i className="icon-chevron-down"/></div>;
	}

	getStringForType (type) {
		return type && (type.type + ' ' + type.unit);
	}

	renderOption = (option) => {
		const {entry} = this.props;

		const remainingTypes = this.props.remainingTypes || [];

		const disabled = !remainingTypes.filter(x => x.creditDefinition + ' ' + x.unit).includes(option);

		const className = cx('credit-type-option', {disabled, selected: this.getStringForType(option) === this.getStringForType(entry.creditDefinition)});

		return <div key={this.getStringForType(option)} className={className}><CreditEntryTypeOption option={option} onClick={disabled ? null : this.typeChanged}/></div>;
	}

	launchAddTypeDialog = () => {
		AddCreditType.show(this.props.allTypes).then(savedType => {
			const {onNewTypeAdded} = this.props;

			if(onNewTypeAdded) {
				onNewTypeAdded(savedType).then(newlyAdded => {
					this.typeChanged(newlyAdded);
				});
			}
		});
	}

	renderAddNewType () {
		return this.state.canAddTypes && <div className="credit-type-option add-new" onClick={this.launchAddTypeDialog}>{t('addNewType')}</div>;
	}

	renderEditableType () {
		return (
			<Flyout.Triggered
				className="transcript-credit-type-select"
				trigger={this.renderTypeTrigger()}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				sizing={Flyout.SIZES.MATCH_SIDE}
				ref={this.attachFlyoutRef}
			>
				<div>
					{this.props.allTypes.map(this.renderOption)}
					{this.renderAddNewType()}
				</div>
			</Flyout.Triggered>
		);
	}

	renderRemoveButton () {
		return <RemoveButton onRemove={this.removeEntry}/>;
	}


	render () {
		const {editable, removable} = this.props;

		return (
			<div className="credit-entry">
				{editable ? this.renderEditableValue() : this.renderValue()}
				{editable ? this.renderEditableType() : this.renderType()}
				{editable && removable && this.renderRemoveButton()}
			</div>
		);
	}
}
