import React from 'react';

import { Input as _Input, Prompt } from '@nti/web-commons';
import { Button, useReducerState } from '@nti/web-core';
import { useStoreValue } from '@nti/lib-store';
import { equals } from '@nti/lib-commons';

import { PrecisionInput as _PrecisionInput } from './PrecisionInput';

//#region Paint

export const ErrorMessage = styled('div').attrs({ className: 'error' })`
	margin-bottom: 1rem;
	margin-top: 0.5rem;
	font-size: 14px;
	color: red;
	text-align: center;
`;

const Row = styled.div`
	margin-bottom: 1.2rem;
	display: flex;
	position: relative;
	align-items: center;
	flex-direction: row;
	gap: 10px;

	&.edit {
		box-shadow: 1px 1px 1px 1px #ddd;
		padding: 6px;
		margin-left: -20px;
	}

	&.disabled {
		opacity: 0.5;
	}
`;

export const Controls = styled.div`
	flex: 0 0 auto;
	display: flex;
	gap: 10px;
	align-items: center;
	width: 54px;

	&:empty()::after {
		content: ' ';
	}

	&.edit {
		width: 125px;
	}
`;

const Cancel = styled(Button).attrs({ plain: true, ['data-testid']: 'cancel' })`
	/* Cancel */
`;

const Confirm = styled(Button).attrs({
	rounded: true,
	['data-testid']: 'confirm',
})`
	padding: 9px 20px;
`;

const Input = styled(_Input.Text)`
	flex: 1 1 33%;
	width: 0;
`;

const PrecisionInput = styled(_PrecisionInput)`
	flex: 1 1 33%;
	width: 0;
`;

const Value = styled('div').attrs({ className: 'credit-value' })`
	flex: 1 1 33%;
	font-size: 14px;
	line-height: 28px;
	color: var(--secondary-grey);
`;

const Icon = styled.i`
	color: var(--tertiary-grey);
	font-size: 22px;
	line-height: 32px;
	cursor: pointer;
`;

//#endregion

export function CreditType({
	type,
	onRemove,
	onEnterEditMode,
	onExitEditMode,
	onNewEntryCancel,
	disabled,
	inEditMode,
}) {
	const { saveCreditType, error } = useStoreValue();
	const [{ definition }, setState] = useReducerState(
		{
			definition: { ...type },
		},
		[type]
	);

	const exitEdit = () => onExitEditMode?.(type);

	const onChange = (key, val) => {
		const updated = { ...definition, [key]: val };
		setState({ definition: updated });
	};

	const _onRemove = () => {
		Prompt.areYouSure('Do you want to remove this credit definition?').then(
			() => {
				onRemove?.(type);
			}
		);
	};

	const enterEdit = () => {
		onEnterEditMode?.(type);
	};

	const onCancel = () => {
		setState({ definition: type });
		exitEdit();
		if (type.addedRow) {
			onNewEntryCancel?.();
		}
	};

	const onConfirm = async () => {
		let good = true;
		if (definition.addedRow || !equals(type, definition)) {
			good = !!(await saveCreditType(definition));
		}

		if (good) {
			exitEdit();
		}
	};

	if (!definition) {
		return null;
	}

	return (
		<>
			{inEditMode && error && (
				<ErrorMessage>{error.message ?? error}</ErrorMessage>
			)}
			<Row className="credit-type" disabled={disabled} edit={inEditMode}>
				{inEditMode ? (
					<Input
						autoFocus
						className="type"
						value={definition.type}
						onChange={onChange.bind(null, 'type')}
					/>
				) : (
					<Value>{definition.type}</Value>
				)}

				{inEditMode ? (
					<Input
						className="unit"
						value={definition.unit}
						onChange={onChange.bind(null, 'unit')}
					/>
				) : (
					<Value>{definition.unit}</Value>
				)}

				{inEditMode ? (
					<PrecisionInput
						className="precision"
						value={definition.precision}
						onChange={onChange.bind(null, 'precision')}
					/>
				) : (
					<Value>{definition.precision}</Value>
				)}

				<Controls edit={inEditMode || disabled}>
					{inEditMode ? (
						<Confirm onClick={onConfirm}>OK</Confirm>
					) : !disabled ? (
						<Icon className="icon-edit" onClick={enterEdit} />
					) : null}

					{inEditMode ? (
						<Cancel onClick={onCancel}>Cancel</Cancel>
					) : !disabled ? (
						<Icon className="icon-remove" onClick={_onRemove} />
					) : null}
				</Controls>
			</Row>
		</>
	);
}
