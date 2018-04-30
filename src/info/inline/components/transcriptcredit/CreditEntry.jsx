import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {Input, Flyout, RemoveButton} from '@nti/web-commons';

import AddCreditType from './AddCreditType';
import CreditEntryTypeOption from './CreditEntryTypeOption';


const t = scoped('course.info.inline.components.transcriptcredit.CreditEntry', {
	addNewType: 'Add New Type...'
});

export default class TranscriptCreditEntry extends React.Component {
	static propTypes = {
		entry: PropTypes.object.isRequired,
		allTypes: PropTypes.arrayOf(PropTypes.string),
		remainingTypes: PropTypes.arrayOf(PropTypes.string),
		onRemove: PropTypes.func,
		onChange: PropTypes.func,
		onNewTypeAdded: PropTypes.func,
		editable: PropTypes.bool
	}

	attachFlyoutRef = x => this.flyout = x

	constructor (props) {
		super(props);

		this.state = {};
	}

	valueChanged = (val) => {
		const {onChange, entry} = this.props;

		this.setState({value: val});

		if(onChange) {
			const newEntry = {...entry, value: val};

			onChange(newEntry);
		}
	}

	typeChanged = (val) => {
		const {onChange, entry} = this.props;

		this.setState({type: val});

		if(onChange) {
			const newEntry = {...entry, type: val};

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
		return <div className="credit-value">{this.props.entry.value}</div>;
	}

	renderEditableValue () {
		return <Input.Text className="credit-value" value={this.props.entry.value} onChange={this.valueChanged}/>;
	}

	renderType () {
		return <div className="credit-type">{this.props.entry.type}</div>;
	}


	renderTypeTrigger () {
		return <div className="credit-type-select">{this.props.entry.type}<i className="icon-chevron-down"/></div>;
	}

	renderOption = (option) => {
		const remainingTypes = this.props.remainingTypes || [];

		const className = cx('credit-type-option', {disabled: !remainingTypes.includes(option), selected: option === this.props.entry.type});

		return <div className={className}><CreditEntryTypeOption option={option} onClick={this.typeChanged}/></div>;
	}

	launchAddTypeDialog = () => {
		AddCreditType.show(this.props.allTypes).then(savedType => {
			const {onNewTypeAdded} = this.props;

			if(onNewTypeAdded) {
				onNewTypeAdded(savedType);

				this.typeChanged(savedType);
			}
		});
	}

	renderAddNewType () {
		return <div className="credit-type-option add-new" onClick={this.launchAddTypeDialog}>{t('addNewType')}</div>;
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
		const {editable} = this.props;

		return (
			<div className="credit-entry">
				{editable ? this.renderEditableValue() : this.renderValue()}
				{editable ? this.renderEditableType() : this.renderType()}
				{editable && this.renderRemoveButton()}
			</div>
		);
	}
}
