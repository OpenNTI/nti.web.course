import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import AddButton from '../../widgets/AddButton';

import CreditTypeStore from './managetypes/CreditTypesStore';
import CreditEntry from './CreditEntry';


const t = scoped('course.info.inline.components.transcriptcredit.edit', {
	label: 'Transcript Credit Hours',
	addCredit: 'Add Credit'
});

export default class TranscriptCreditEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		enrollmentAccess: PropTypes.object,
		onValueChange: PropTypes.func
	}

	constructor (props) {
		super(props);

		this.creditTypeStore = CreditTypeStore.getInstance();

		//TODO: transcripts - get entries from course
		this.state = {
			entries: [
				{NTIID: 'nti_1', value: 15, type: 'ECTS points'}
			]
		};
	}

	componentDidMount () {
		this.loadTypes();
	}

	async loadTypes () {
		await this.creditTypeStore.loadAllTypes();

		this.setState({creditTypes: this.creditTypeStore.getTypesAsStrings()}, () => {
			this.determineRemainingTypes();
		});
	}

	determineRemainingTypes () {
		const allTypes = this.state.creditTypes;
		const takenTypes = this.state.entries.map(x => x.type);
		const remainingTypes = allTypes.filter(x => !takenTypes.includes(x));

		this.setState({
			remainingTypes
		});
	}

	afterUpdate () {
		this.determineRemainingTypes();

		this.updateValues();
	}

	updateValues () {
		const { onValueChange } = this.props;

		onValueChange && onValueChange('transcriptCredits', this.state.entries);
	}

	removeEntry = (entry) => {
		const entries = [...this.state.entries].filter(x => this.getEffectiveId(x) !== this.getEffectiveId(entry));

		this.setState({entries}, this.afterUpdate);
	}

	getEffectiveId (entry) {
		return entry.NTIID || entry.addID;
	}

	onEntryChange = (entry) => {
		const entries = this.state.entries.map(x => {
			if(this.getEffectiveId(x) === this.getEffectiveId(entry)) {
				return entry;
			}

			return x;
		});

		this.setState({entries}, this.afterUpdate);
	}

	findNewID () {
		const existingIDs = this.state.entries
			.filter(x => x.addID)
			.map(x => parseInt(x.addID, 10))
			.sort();

		let newID = existingIDs.length === 0 ? 1 : existingIDs[existingIDs.length - 1] + 1;
		return newID.toString();
	}

	addEntry = () => {
		const entries = [...this.state.entries];

		const entry = {
			addID: this.findNewID(),
			value: 1,
			type: this.state.remainingTypes[0]
		};

		entries.push(entry);

		this.setState({entries}, this.afterUpdate);
	}

	onNewTypeAdded = async (newType) => {
		// when adding a new type on the fly, we should wait for the store to save values,
		// then update our state with the reloaded type data from the store
		await this.creditTypeStore.saveValues([newType]);

		this.setState({creditTypes: this.creditTypeStore.getTypesAsStrings()}, () => {
			this.afterUpdate();
		});
	}

	renderEntry = (entry) => {
		return (
			<CreditEntry
				key={this.getEffectiveId(entry)}
				entry={entry}
				onRemove={this.removeEntry}
				onChange={this.onEntryChange}
				allTypes={this.state.creditTypes}
				remainingTypes={this.state.remainingTypes}
				onNewTypeAdded={this.onNewTypeAdded}
				editable
			/>
		);
	}

	renderContent () {
		const {remainingTypes} = this.state;

		return (
			<div className="content">
				<div className="credit-entries">
					{(this.state.entries || []).map(this.renderEntry)}
				</div>
				{remainingTypes && remainingTypes.length > 0 && <AddButton clickHandler={this.addEntry} className="add-credit" label={t('addCredit')}/>}
			</div>
		);
	}

	render () {
		const {creditTypes} = this.state;

		if(!creditTypes) {
			return null;
		}

		return (
			<div className="columned transcript-credit-hours edit">
				<div className="field-info">
					<div className="date-label">{t('label')}</div>
				</div>
				<div className="content-column">{this.renderContent()}</div>
			</div>
		);
	}
}
