import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {getService} from '@nti/web-client';

import AddButton from '../../widgets/AddButton';
import CreditViewContents from '../credit/Contents';

import Disclaimer from './Disclaimer';
import Store from './managetypes/CreditTypesStore';
import CreditEntry from './CreditEntry';
import AddCreditType from './AddCreditType';


const t = scoped('course.info.inline.components.transcriptcredit.edit', {
	label: 'Credits',
	addCredit: 'Add Credit',
	addDefinition: 'Add New Type',
	noRemainingTypes: 'To add a new credit, a new credit type is required',
	noTypes: 'To get started, add a new credit type',
	noTypesCantAdd: 'There are no credit types defined'
});

export default
@Store.connect({
	loading: 'loading',
	types: 'types',
	error: 'error'
})
class TranscriptCreditEdit extends React.Component {
	static propTypes = {
		store: PropTypes.object.isRequired,
		catalogEntry: PropTypes.object.isRequired,
		enrollmentAccess: PropTypes.object,
		onValueChange: PropTypes.func
	}

	static FIELD_NAME = 'awardable_credits';

	constructor (props) {
		super(props);

		// in this context, we are using type to indicate the type reference that we change
		this.state = {
			entries: props.catalogEntry.credits || []
		};
	}

	componentDidMount () {
		this.loadTypes();

		getService().then(service => {
			const creditDefs = service.getCollection('CreditDefinitions', 'Global');

			this.setState({canAddTypes: creditDefs.accepts && creditDefs.accepts.length > 0});
		});
	}

	async loadTypes () {
		const {store} = this.props;

		await store.loadAllTypes();

		this.setState({creditTypes: store.getTypes()}, () => {
			this.determineRemainingTypes();
		});
	}

	determineRemainingTypes () {
		const allTypes = this.state.creditTypes;
		const takenTypes = this.state.entries.filter(x => x.creditDefinition).map(x => x.creditDefinition.type + ' ' + x.creditDefinition.unit);
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

	addEntry = (providedType) => {
		const entries = [...this.state.entries];

		entries.push({
			addID: this.findNewID(),
			amount: 1,
			creditDefinition: providedType || this.state.remainingTypes[0]
		});

		this.setState({entries}, this.afterUpdate);
	}

	onAddClick = () => {
		this.addEntry();
	}

	onNewTypeAdded = async (newType) => {
		const {store} = this.props;
		const {creditTypes} = this.state;

		const newCreditTypes = store.getTypes();

		const newlyAdded = newCreditTypes.filter(x => !creditTypes.map(y => y.NTIID).includes(x.NTIID))[0];

		this.setState({creditTypes: store.getTypes()}, () => {
			this.afterUpdate();
		});

		return newlyAdded;
	}

	renderEntry = (entry) => {
		return (
			<CreditEntry
				key={this.getEffectiveId(entry)}
				store={this.props.store}
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

	launchAddTypeDialog = () => {
		AddCreditType.show(this.props.store).then(savedType => {
			this.onNewTypeAdded(savedType).then((newTypeDef) => {
				this.addEntry(newTypeDef);
			});
		});
	}

	renderAddNewType () {
		const {creditTypes} = this.state;

		let infoText = t('noTypes');

		if(creditTypes && creditTypes.length > 0) {
			infoText = t('noRemainingTypes');

			if(!this.state.canAddTypes) {
				return null;
			}
		}

		if(!this.state.canAddTypes) {
			return <div>{t('noTypesCantAdd')}</div>;
		}

		return <div className="add-definition"><div className="info-text">{infoText}</div><div onClick={this.launchAddTypeDialog} className="add-definition-button">{t('addDefinition')}</div></div>;
	}

	renderTranscriptCredits () {
		const {remainingTypes} = this.state;

		return (
			<div className="content">
				<div className="credit-entries">
					{(this.state.entries || []).map(this.renderEntry)}
				</div>
				{remainingTypes && remainingTypes.length > 0 && <AddButton clickHandler={this.onAddClick} className="add-credit" label={t('addCredit')}/>}
				{!remainingTypes || remainingTypes.length === 0 && this.renderAddNewType()}
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
					<Disclaimer />
				</div>
				<div className="content-column">{this.renderContent()}</div>
			</div>
		);
	}
}
