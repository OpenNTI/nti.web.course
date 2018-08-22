import React from 'react';
import PropTypes from 'prop-types';
import {ConflictResolution} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import {Connectors} from '@nti/lib-store';

import AddButton from '../../../widgets/AddButton';

import CreditType from './CreditType';

const t = scoped('course.info.inline.components.transcriptcredit.managetypes.ManageCreditTypes', {
	addNewType: 'Add New Type',
	type: 'Type',
	unit: 'Unit'
});

export default
@Connectors.Any.connect({
	loading: 'loading',
	types: 'types',
	error: 'error'
})
class ManageCreditTypes extends React.Component {
	static propTypes = {
		loading: PropTypes.bool,
		types: PropTypes.arrayOf(PropTypes.object),
		error: PropTypes.string,
		store: PropTypes.object,
		onValuesUpdated: PropTypes.func
	}


	state = {}


	componentDidMount () {
		const {store} = this.props;

		ConflictResolution.registerHandler('DuplicateCreditDefinitionError', this.saveConflictHandler);

		if(store) {
			store.loadAllTypes();
		}
	}


	componentWillUnmount () {
		ConflictResolution.unregisterHandler('DuplicateCreditDefinitionError', this.saveConflictHandler);
	}

	saveConflictHandler = (challenge) => {
		return new Promise((confirm, reject) => {
			challenge.reject();
		});
	}


	componentDidUpdate (oldProps) {
		if(oldProps.types !== this.props.types) {
			this.setState({
				types: this.props.types,
				flaggedForRemoval: null
			});
		}
	}

	updateValues = () => {
		const {onValuesUpdated} = this.props;

		if(onValuesUpdated) {
			onValuesUpdated(this.state.types, this.state.flaggedForRemoval);
		}
	}

	onEntryChange = (updatedEntry) => {
		const newTypes = this.state.types.map(x => {
			if(this.getEffectiveId(x) === this.getEffectiveId(updatedEntry)) {
				return updatedEntry;
			}

			return x;
		});

		this.setState({types: newTypes}, this.updateValues);
	}

	addEntry = () => {
		const newType = {
			addID: this.findNewID(),
			type: '',
			unit: '',
			disabled: false,
			addedRow: true
		};

		const newTypes = [...this.state.types, newType];

		this.setState({types: newTypes, typeInEditMode: newType}, this.updateValues);
	}

	onEntryRemove = async (removedEntry) => {
		await this.props.store.removeValues([removedEntry]);

		await this.props.store.loadAllTypes();
	}

	onExitEditMode = (type) => {
		this.setState({typeInEditMode: null});
	}

	onEnterEditMode = (type) => {
		this.setState({typeInEditMode: type});
	}

	onNewEntryCancel = () => {
		const newTypes = this.state.types.filter(x => !x.addedRow);

		this.setState({types: newTypes});
	}

	renderType = (type) => {
		const {typeInEditMode} = this.state;

		let disabled = true;
		let inEditMode = false;

		if(typeInEditMode == null) {
			disabled = false;
		}

		if(this.getEffectiveId(typeInEditMode) === this.getEffectiveId(type)) {
			disabled = false;
			inEditMode = true;
		}

		return (
			<CreditType
				key={this.getEffectiveId(type)}
				store={this.props.store}
				type={type}
				onEnterEditMode={this.onEnterEditMode}
				onExitEditMode={this.onExitEditMode}
				onChange={this.onEntryChange}
				onRemove={this.onEntryRemove}
				onNewEntryCancel={this.onNewEntryCancel}
				disabled={disabled}
				inEditMode={inEditMode}/>
		);
	}


	getEffectiveId (entry) {
		return entry && (entry.NTIID || entry.addID);
	}

	findNewID () {
		const existingIDs = this.state.types
			.filter(x => x.addID)
			.map(x => parseInt(x.addID, 10))
			.sort();

		let newID = existingIDs.length === 0 ? 1 : existingIDs[existingIDs.length - 1] + 1;
		return newID.toString();
	}

	renderTypesEditor () {
		const {types, typeInEditMode} = this.state;

		if(!types) {
			return null;
		}

		return (
			<div className="all-types">
				{types && types.length > 0 && (
					<div className="header">
						<span className="header-text">{t('type')}</span>
						<span className="header-text">{t('unit')}</span>
					</div>
				)}
				{types.map(this.renderType)}
				{typeInEditMode == null && (
					<div className="add-type">
						<AddButton label={t('addNewType')} clickHandler={this.addEntry}/>
					</div>
				)}
			</div>
		);
	}

	render () {
		const {error} = this.state;

		return (
			<div className="manage-credit-types">
				{error && <div className="error">{error}</div>}
				{this.renderTypesEditor()}
			</div>
		);
	}
}
