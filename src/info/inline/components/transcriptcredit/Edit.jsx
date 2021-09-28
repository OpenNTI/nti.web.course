import './Edit.scss';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { useStoreValue } from '@nti/lib-store';
import { Prompt, useToggle } from '@nti/web-commons';

import AddButton from '../../widgets/AddButton';
import { CreditViewContents } from '../credit/Contents';

import Disclaimer from './Disclaimer';
import Store from './managetypes/Store';
import CreditEntry from './CreditEntry';
import AddCreditType from './AddCreditType';

const t = scoped('course.info.inline.components.transcriptcredit.edit', {
	label: 'Credits',
	addCredit: 'Add Credit',
	addDefinition: 'Add New Type',
	noRemainingTypes: 'To add a new credit, a new credit type is required',
	noTypes: 'To get started, add a new credit type',
	noTypesCantAdd: 'There are no credit types defined',
});

TranscriptCreditEdit.propTypes = {
	catalogEntry: PropTypes.object.isRequired,
	enrollmentAccess: PropTypes.object,
	onValueChange: PropTypes.func,
};

TranscriptCreditEdit.FIELD_NAME = 'awardable_credits';

const EMPTY = Object.freeze([]);

function TranscriptCreditEdit({
	catalogEntry,
	enrollmentAccess,
	onValueChange,
}) {
	const { canAddTypes, types: creditTypes } = useStoreValue();
	// in this context, we are using type to indicate the type reference that we change
	const [entries, setEntries] = useState(catalogEntry?.credits || EMPTY);
	const [showAddModal, toggleAddModal] = useToggle();
	const remainingTypes = determineRemainingTypes(creditTypes, entries);
	const hasLegacyCredit = Boolean(catalogEntry?.Credit?.[0]);
	const infoText =
		creditTypes?.length > 0 ? t('noRemainingTypes') : t('noTypes');

	useEffect(() => {
		setEntries(catalogEntry?.credits || EMPTY);
	}, [catalogEntry?.entries]);
	useEffect(() => {
		updateValues(onValueChange, entries);
	}, [onValueChange, entries]);

	const removeEntry = entry => {
		setEntries(
			[...entries].filter(
				x => getEffectiveId(x) !== getEffectiveId(entry)
			)
		);
	};

	const onEntryChange = (entry, error) => {
		setEntries(
			entries.map(x =>
				getEffectiveId(x) === getEffectiveId(entry) ? entry : x
			)
		);
	};

	const addEntry = providedType => {
		setEntries([
			...entries,
			{
				addID: findNewID(entries),
				amount: 1,
				creditDefinition: providedType || remainingTypes[0],
			},
		]);
	};

	const onNewTypeAdded = async newType => {
		const [newlyAdded] = creditTypes.filter(
			x => !creditTypes.map(y => y.NTIID).includes(x.NTIID)
		);

		addEntry(newlyAdded);
		return newlyAdded;
	};

	return !creditTypes ? null : (
		<>
			<div className="columned transcript-credit-hours edit">
				<div className="field-info">
					<div className="date-label">{t('label')}</div>
					<Disclaimer />
				</div>
				<div className="content-column">
					<div className="credits-container edit">
						{hasLegacyCredit && (
							<div className="legacy-credits">
								<CreditViewContents
									{...{ catalogEntry, enrollmentAccess }}
								/>
							</div>
						)}
						<div className="content">
							<div className="credit-entries">
								{(entries || []).map(entry => (
									<CreditEntry
										key={getEffectiveId(entry)}
										entry={entry}
										onRemove={removeEntry}
										onChange={onEntryChange}
										remainingTypes={remainingTypes}
										removable={entries?.length > 1}
										editable
									/>
								))}
							</div>
							{remainingTypes?.length > 0 ? (
								<AddButton
									clickHandler={() => addEntry()}
									className="add-credit"
									label={t('addCredit')}
								/>
							) : creditTypes?.length > 0 &&
							  !canAddTypes ? null : !canAddTypes ? (
								<div>{t('noTypesCantAdd')}</div>
							) : (
								<div className="add-definition">
									<div className="info-text">{infoText}</div>
									<div
										onClick={() => toggleAddModal(true)}
										className="add-definition-button"
									>
										{t('addDefinition')}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{showAddModal && (
				<Prompt.Dialog
					closeOnMaskClick
					closeOnEscape
					onBeforeDismiss={() => toggleAddModal(false)}
				>
					<AddCreditType
						existingTypes={creditTypes}
						onSave={onNewTypeAdded}
					/>
				</Prompt.Dialog>
			)}
		</>
	);
}

export const Edit = Store.compose(TranscriptCreditEdit);

function determineRemainingTypes(creditTypes, credits) {
	const takenTypes = credits
		.filter(x => x.creditDefinition)
		.map(x => x.creditDefinition.toString());
	const remainingTypes = creditTypes?.filter(
		x => !takenTypes.includes(x.toString())
	);

	return remainingTypes ?? [];
}

function getEffectiveId(entry) {
	return entry.NTIID || entry.addID;
}

function findNewID(entries) {
	const existingIDs = entries
		.filter(x => x.addID)
		.map(x => parseInt(x.addID, 10))
		.sort();

	let newID =
		existingIDs.length === 0 ? 1 : existingIDs[existingIDs.length - 1] + 1;
	return newID.toString();
}

function updateValues(onValueChange, entries, error) {
	onValueChange?.(
		'awardable_credits',
		entries.map(x => ({
			amount: x.amount,
			credit_definition: x.creditDefinition.NTIID,
			MimeType:
				'application/vnd.nextthought.credit.courseawardablecredit',
		})),
		error
	);
}
