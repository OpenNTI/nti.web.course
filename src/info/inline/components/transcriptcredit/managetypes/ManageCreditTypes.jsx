import React, { useEffect } from 'react';

import { ConflictResolution } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import { useStoreValue } from '@nti/lib-store';
import { useReducerState } from '@nti/web-core';

import AddButton from '../../../widgets/AddButton';

import { Controls, CreditType } from './CreditType';
import Store from './Store';

const t = scoped(
	'course.info.inline.components.transcriptcredit.managetypes.ManageCreditTypes',
	{
		addNewType: 'Add New Type',
		type: 'Type',
		unit: 'Unit',
		precision: 'Precision',
	}
);

//#region Paint

const Container = styled.div`
	padding: 2rem;
	margin: 0 5rem;
`;

const Header = styled.div`
	display: flex;
	align-items: flex-start;
	margin-bottom: 0.3rem;
	gap: 10px;

	span {
		flex: 1 1 33%;
		font-size: 10px;
		text-transform: uppercase;
		font-weight: 600;
		color: var(--tertiary-grey);
		text-align: left;
	}
`;

//#endregion

export const useNoConflictResolver = () => {
	useEffect(() => {
		const nope = challenge => challenge.reject();

		ConflictResolution.registerHandler(
			'DuplicateCreditDefinitionError',
			nope
		);

		return () => {
			ConflictResolution.unregisterHandler(
				'DuplicateCreditDefinitionError',
				nope
			);
		};
	}, []);
};

const getEffectiveId = entry => entry && (entry.NTIID || entry.addID);

const findNewID = types => {
	const existingIDs = types
		.filter(x => x.addID)
		.map(x => parseInt(x.addID, 10))
		.sort();

	let newID =
		existingIDs.length === 0 ? 1 : existingIDs[existingIDs.length - 1] + 1;
	return newID.toString();
};

function ManageCreditTypes({ onValuesUpdated }) {
	const { types: _types, clearError, removeCreditType } = useStoreValue();
	const [{ types, typeInEditMode, flaggedForRemoval }, setState] =
		useReducerState({
			types: null,
			typeInEditMode: null,
			flaggedForRemoval: null,
		});

	useNoConflictResolver();

	useEffect(() => {
		setState({
			types: _types,
			flaggedForRemoval: null,
		});
	}, [_types]);

	useEffect(() => {
		onValuesUpdated?.(types, flaggedForRemoval);
	}, [types, flaggedForRemoval]);

	const addEntry = () => {
		const newType = {
			addID: findNewID(types),
			type: '',
			unit: '',
			disabled: false,
			addedRow: true,
		};

		setState({ types: [...types, newType], typeInEditMode: newType });
	};

	const onEntryRemove = async removedEntry => {
		await removeCreditType(removedEntry);
	};

	const onExitEditMode = type => {
		clearError();
		setState({ typeInEditMode: null });
	};

	const onEnterEditMode = type => {
		setState({ typeInEditMode: type });
	};

	const onNewEntryCancel = () => {
		setState({ types: types.filter(x => !x.addedRow) });
	};

	return (
		<Container className="manage-credit-types">
			<div className="all-types">
				{types?.length > 0 && (
					<Header>
						<span>{t('type')}</span>
						<span>{t('unit')}</span>
						<span>{t('precision')}</span>
						<Controls edit={!!typeInEditMode} />
					</Header>
				)}
				{types?.map(type => {
					let disabled = true;
					let inEditMode = false;

					if (typeInEditMode == null) {
						disabled = false;
					}

					if (
						getEffectiveId(typeInEditMode) === getEffectiveId(type)
					) {
						disabled = false;
						inEditMode = true;
					}

					return (
						<CreditType
							key={getEffectiveId(type)}
							type={type}
							onEnterEditMode={onEnterEditMode}
							onExitEditMode={onExitEditMode}
							onRemove={onEntryRemove}
							onNewEntryCancel={onNewEntryCancel}
							disabled={disabled}
							inEditMode={inEditMode}
						/>
					);
				})}

				{typeInEditMode == null && (
					<AddButton
						label={t('addNewType')}
						clickHandler={addEntry}
					/>
				)}
			</div>
		</Container>
	);
}

const composed = Store.compose(ManageCreditTypes);
export { composed as ManageCreditTypes };
