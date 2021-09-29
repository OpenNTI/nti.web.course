import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';
import {
	Input,
	Flyout,
	RemoveButton as _RemoveButton,
	Prompt,
	useToggle,
} from '@nti/web-commons';
import { useStoreValue } from '@nti/lib-store';

import AddCreditType from './AddCreditType';

const t = scoped('course.info.inline.components.transcriptcredit.CreditEntry', {
	addNewType: 'Add New Type...',
});

//#region paint

const ScrollPane = styled('div').attrs(
	// prevent these props from getting to the dom
	({ onDismiss, dismissFlyout, ...props }) => props
)`
	max-height: 11rem;
`;

const Option = styled.div`
	padding: 0.5rem;
	cursor: pointer;

	&.disabled {
		cursor: initial;
		color: var(--tertiary-grey);
	}

	&.create {
		color: var(--primary-blue);
		padding: 0.5rem;
		cursor: pointer;
	}
`;

const Select = styled(Flyout.Triggered)`
	:global(.flyout-inner) {
		width: 8rem;
		font-size: 12px;
		color: var(--primary-grey);
	}
`;

const SelectButton = styled.div`
	border: solid 1px #ddd;
	border-left: none;
	height: 40px;
	padding: 0 20px 0 10px;
	margin-left: -5px; /* negative gap */
	line-height: 40px;
	font-size: 14px;
	font-weight: 300;
	color: #747474;
	position: relative;
	width: 10rem;
	cursor: pointer;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	background-color: var(--panel-background);

	i {
		position: absolute;
		right: 0.8rem;
		top: 0.9rem;
		font-size: 10px;
	}
`;

const RemoveButton = styled(_RemoveButton)`
	margin-left: 5px;

	i {
		background-color: var(--tertiary-grey);
		font-size: 9px;
		font-weight: bold;
	}
`;

const Box = styled.div`
	display: flex;
	gap: 5px;
	margin-bottom: 5px;
	align-items: center;

	input {
		width: 3rem;
		font-size: 14px;
		color: var(--primary-grey);
		height: 40px;
		font-weight: 300;
		background-color: white;

		&:invalid {
			background-color: rgba(var(--primary-red-rgb), 0.1);
		}
	}
`;

function EditableType({ entry, remainingTypes, onChange }) {
	const [showAddModal, toggleAddModal] = useToggle();
	const { types: creditTypes } = useStoreValue();
	const ref = useRef();
	const dismiss = () => ref.current?.dismiss();
	return (
		<>
			<Select
				autoDismissOnAction
				data-testid="transcript-credit-type-select"
				trigger={
					<SelectButton data-testid="credit-type-select">
						{entry.creditDefinition.toString()}
						<i className="icon-chevron-down" />
					</SelectButton>
				}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				sizing={Flyout.SIZES.MATCH_SIDE}
				ref={ref}
			>
				<ScrollPane>
					{creditTypes?.map(option => {
						const disabled = !remainingTypes
							.filter(x => x.creditDefinition + ' ' + x.unit)
							.includes(option);

						return (
							<Option
								key={option.toString()}
								disabled={disabled}
								selected={
									option.toString() ===
									entry.creditDefinition.toString()
								}
								onClick={
									disabled
										? null
										: () => (dismiss(), onChange(option))
								}
							>
								{option.toString()}
							</Option>
						);
					})}
					<AddNewType
						onClick={() => (dismiss(), toggleAddModal(true))}
					/>
				</ScrollPane>
			</Select>

			{showAddModal && (
				<Prompt.Dialog
					closeOnMaskClick
					closeOnEscape
					onBeforeDismiss={() => toggleAddModal(false)}
				>
					<AddCreditType
						onSave={newType => {
							toggleAddModal(false);
							onChange(newType);
						}}
					/>
				</Prompt.Dialog>
			)}
		</>
	);
}

function AddNewType({ onClick }) {
	const { canAddTypes } = useStoreValue();
	return (
		canAddTypes && (
			<Option create data-testid="create-new-type" onClick={onClick}>
				{t('addNewType')}
			</Option>
		)
	);
}

const EditableValue = React.forwardRef(({ entry, onChange }, ref) => (
	<Input.Text
		className="credit-value"
		maxLength="6"
		value={(entry.amount || '').toString()}
		onChange={onChange}
		pattern="[0-9]*[.,]?[0-9]+"
		ref={ref}
	/>
));

const Value = ({ entry }) => (
	<div className="credit-value">{entry?.amount?.toFixed(2)}</div>
);

const Type = ({ entry }) => (
	<div className="credit-type">{entry.creditDefinition?.toString()}</div>
);

//#endregion

CreditEntry.propTypes = {
	entry: PropTypes.object.isRequired,
	remainingTypes: PropTypes.arrayOf(PropTypes.object),
	onRemove: PropTypes.func,
	onChange: PropTypes.func,
	onNewTypeAdded: PropTypes.func,
	removable: PropTypes.bool,
	editable: PropTypes.bool,
};

export default function CreditEntry({
	className,
	entry,
	remainingTypes,
	onRemove,
	onChange,
	removable,
	editable,
}) {
	const input = useRef();

	const valueChanged = val => {
		const error = input.current.validity.patternMismatch
			? 'Must be a numeric value'
			: null;

		onChange?.({ ...entry, amount: val }, error);
	};

	const typeChanged = val => {
		onChange?.({ ...entry, creditDefinition: val });
	};

	return (
		<Box className={cx('credit-entry', className)}>
			{editable ? (
				<EditableValue
					entry={entry}
					onChange={valueChanged}
					ref={input}
				/>
			) : (
				<Value entry={entry} />
			)}
			{editable ? (
				<EditableType
					entry={entry}
					onChange={typeChanged}
					remainingTypes={remainingTypes}
				/>
			) : (
				<Type entry={entry} />
			)}
			{editable && removable && (
				<RemoveButton onRemove={() => onRemove?.(entry)} />
			)}
		</Box>
	);
}
