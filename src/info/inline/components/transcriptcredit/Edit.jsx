import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import AddButton from '../../widgets/AddButton';
import CreditViewContents from '../credit/Contents';

import CreditTypeStore from './managetypes/CreditTypesStore';
import CreditEntry from './CreditEntry';


const t = scoped('course.info.inline.components.transcriptcredit.edit', {
	label: 'Credits',
	addCredit: 'Add Credit'
});

export default class TranscriptCreditEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		enrollmentAccess: PropTypes.object,
		onValueChange: PropTypes.func
	}

	static FIELD_NAME = 'awardable_credits';

	constructor (props) {
		super(props);

		this.creditTypeStore = CreditTypeStore.getInstance();

		// in this context, we are using type to indicate the type reference that we change
		this.state = {
			entries: props.catalogEntry.credits || []
		};
	}

	componentDidMount () {
		this.loadTypes();
	}

	async loadTypes () {
		await this.creditTypeStore.loadAllTypes();

		this.setState({creditTypes: this.creditTypeStore.getTypes()}, () => {
			this.determineRemainingTypes();
		});
	}

	determineRemainingTypes () {
		const allTypes = this.state.creditTypes;
		const takenTypes = this.state.entries.map(x => x.creditDefinition.type + ' ' + x.creditDefinition.unit);
		const remainingTypes = allTypes.filter(x => !takenTypes.includes(x.type + ' ' + x.unit));

		this.setState({
			remainingTypes
		});
	}

	afterUpdate (error) {
		this.determineRemainingTypes();

		this.updateValues(error);
	}

	updateValues (error) {
		const { onValueChange } = this.props;

		onValueChange && onValueChange(
			'awardable_credits', this.state.entries.map(x => {
				return {
					amount: x.amount,
					'credit_definition': x.creditDefinition.NTIID,
					MimeType: 'application/vnd.nextthought.credit.courseawardablecredit'
				};
			}),
			error
		);
	}

	removeEntry = (entry) => {
		const entries = [...this.state.entries].filter(x => this.getEffectiveId(x) !== this.getEffectiveId(entry));

		this.setState({entries}, this.afterUpdate);
	}

	getEffectiveId (entry) {
		return entry.NTIID || entry.addID;
	}

	onEntryChange = (entry, error) => {
		const entries = this.state.entries.map(x => {
			if(this.getEffectiveId(x) === this.getEffectiveId(entry)) {
				return entry;
			}

			return x;
		});

		this.setState({entries}, () => { this.afterUpdate(error); });
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
			amount: 1,
			creditDefinition: this.state.remainingTypes[0]
		};

		entries.push(entry);

		this.setState({entries}, this.afterUpdate);
	}

	onNewTypeAdded = async (newType) => {
		const {creditTypes} = this.state;

		// when adding a new type on the fly, we should wait for the store to save values,
		// then update our state with the reloaded type data from the store
		await this.creditTypeStore.saveValues([newType]);

		const newCreditTypes = this.creditTypeStore.getTypes();

		const newlyAdded = newCreditTypes.filter(x => !creditTypes.map(y => y.NTIID).includes(x.NTIID))[0];

		this.setState({creditTypes: this.creditTypeStore.getTypes()}, () => {
			this.afterUpdate();
		});

		return newlyAdded;
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
				removable={this.state.entries && this.state.entries.length > 1}
				editable
			/>
		);
	}

	hasLegacyCredit () {
		return Boolean(this.props.catalogEntry[CreditViewContents.FIELD_NAME] && this.props.catalogEntry[CreditViewContents.FIELD_NAME][0]);
	}

	renderContent () {
		return (
			<div className="credits-container edit">
				{
					this.hasLegacyCredit() && (
						<div className="legacy-credits">
							<CreditViewContents {...this.props}/>
						</div>
					)
				}
				{this.renderTranscriptCredits()}
			</div>
		);
	}

	renderTranscriptCredits () {
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
