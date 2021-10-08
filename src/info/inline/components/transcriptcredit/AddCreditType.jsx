import React, { useEffect } from 'react';

import { useStoreValue } from '@nti/lib-store';
import { scoped } from '@nti/lib-locale';
import { Input, DialogButtons, Panels } from '@nti/web-commons';
import { useReducerState } from '@nti/web-core';

import { useNoConflictResolver } from './managetypes/ManageCreditTypes';
import { PrecisionInput } from './managetypes/PrecisionInput';

const t = scoped(
	'course.info.inline.components.transcriptcredit.AddCreditType',
	{
		addNewType: 'Add New Type...',
		title: 'Add New Credit Type',
		done: 'Save',
		alreadyExists: 'This credit type already exists',
	}
);

//#region paint
const Box = styled.div`
	background-color: white;
`;

const ErrorMessage = styled('div').attrs({ className: 'error' })`
	color: red;
	font-size: 14px;
	margin-bottom: 0.5rem;
	grid-column: 1 / -1;
`;

const Title = styled(Panels.TitleBar)`
	h1 {
		margin-right: 1rem;
	}
`;

const Header = styled('div').attrs({ className: 'header-text' })`
	font-size: 10px;
	text-transform: uppercase;
	font-weight: 600;
	color: var(--tertiary-grey);
	margin-bottom: 0.3rem;
`;

const Content = styled.div`
	padding: 1rem;
	text-align: center;
	display: grid;
	grid-template-columns: 1fr 1fr 0.8fr;
	gap: 1rem;

	input {
		width: 8rem;
	}
`;

const InputBox = styled.div`
	flex: 1 1 auto;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
`;

//#endregion

/**
 * @param {object} props
 * @param {(object) => void} props.onSave
 * @param {() => void} props.onDismiss
 * @returns {JSX.Element}
 */
export function AddCreditType({ onSave: _onSave, onDismiss }) {
	const [{ unit, type, precision }, setState] = useReducerState({
		unit: '',
		type: '',
		precision: 2,
	});
	const { clearError, error, saveCreditType } = useStoreValue();

	useNoConflictResolver();

	// clear the error on unmount
	useEffect(() => () => clearError(), []);

	const onSave = async () => {
		const result = await saveCreditType({ type, unit, precision });
		if (result) {
			_onSave?.(result);
			onDismiss?.();
		}
	};

	return (
		<Box className="add-credit-type">
			<Title title={t('title')} iconAction={onDismiss} />
			<Content className="content">
				{error && <ErrorMessage>{error.message ?? error}</ErrorMessage>}

				<InputBox>
					<Header>Type</Header>
					<Input.Text
						autoFocus
						value={type}
						className="type"
						onChange={v => setState({ type: v })}
					/>
				</InputBox>

				<InputBox>
					<Header>Unit</Header>
					<Input.Text
						value={unit}
						className="unit"
						onChange={v => setState({ unit: v })}
					/>
				</InputBox>

				<InputBox>
					<Header>Precision</Header>
					<PrecisionInput
						value={precision}
						className="precision"
						onChange={v => setState({ precision: v })}
					/>
				</InputBox>
			</Content>
			<DialogButtons buttons={[{ label: t('done'), onClick: onSave }]} />
		</Box>
	);
}
