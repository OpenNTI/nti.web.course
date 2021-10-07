import React, { useEffect, useState } from 'react';
import { v4 as newId } from 'uuid';

import { scoped } from '@nti/lib-locale';
import { useStoreValue } from '@nti/lib-store';
import { Prompt, useToggle } from '@nti/web-commons';
import { ErrorMessage } from '@nti/web-core';

import _AddButton from '../../widgets/AddButton';
import { CreditViewContents } from '../credit/Contents';

import Disclaimer from './Disclaimer';
import Store from './managetypes/Store';
import CreditEntry from './CreditEntry';
import { AddCreditType } from './AddCreditType';

const t = scoped('course.info.inline.components.transcriptcredit.edit', {
	label: 'Credits',
	addCredit: 'Add Credit',
	addDefinition: 'Add New Type',
	noRemainingTypes: 'To add a new credit, a new credit type is required',
	noTypes: 'To get started, add a new credit type',
	noTypesCantAdd: 'There are no credit types defined',
});

//#region paint

const AddButton = styled(_AddButton)`
	:global {
		.add-icon {
			display: none;
		}

		/* .add-label {
			margin-left: 15px;
		} */
	}
`;

const Column = styled('div').attrs({ className: 'content-column' })`
	width: 100%;
`;

const LegacyCredits = styled('div').attrs({ className: 'legacy-credits' })`
	padding: 0.5rem;
	border-radius: 5px;
	border: solid 1px #ddd;
	opacity: 0.5;
	pointer-events: none;
`;

const InfoText = styled('div').attrs({ className: 'info-text' })`
	font-size: 12px;
	margin: 0.5rem 0;
`;

const AddDefinitionButton = styled('a').attrs({
	className: 'add-definition-button',
	href: '#',
})`
	color: var(--primary-blue);
	cursor: pointer;
`;

//#endregion

TranscriptCreditEdit.FIELD_NAME = 'awardable_credits';

const EMPTY = Object.freeze([]);

function TranscriptCreditEdit({
	error,
	catalogEntry,
	enrollmentAccess,
	onValueChange,
}) {
	//#region hooks

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
				addID: newId(),
				amount: 1,
				creditDefinition: providedType || remainingTypes[0],
			},
		]);
	};

	//#endregion

	return !creditTypes ? null : (
		<>
			<div className="columned transcript-credit-hours edit">
				<div className="field-info">
					<div className="date-label">{t('label')}</div>
					<Disclaimer />
				</div>
				<Column>
					<div className="credits-container edit">
						{hasLegacyCredit && (
							<LegacyCredits>
								<CreditViewContents
									{...{ catalogEntry, enrollmentAccess }}
								/>
							</LegacyCredits>
						)}
						<div className="content">
							{error && <ErrorMessage error={error} />}
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
									<InfoText>{infoText}</InfoText>
									<AddDefinitionButton
										onClick={toggleAddModal}
									>
										{t('addDefinition')}
									</AddDefinitionButton>
								</div>
							)}
						</div>
					</div>
				</Column>
			</div>

			{showAddModal && (
				<Prompt.Dialog
					closeOnMaskClick
					closeOnEscape
					onBeforeDismiss={() => toggleAddModal(false)}
				>
					<AddCreditType
						existingTypes={creditTypes}
						onSave={addEntry}
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
