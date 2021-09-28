import './CreditEntry.scss';
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';
import {
	Input,
	Flyout,
	RemoveButton,
	Prompt,
	useToggle,
} from '@nti/web-commons';
import { useStoreValue } from '@nti/lib-store';

import AddCreditType from './AddCreditType';
import CreditEntryTypeOption from './CreditEntryTypeOption';

const t = scoped('course.info.inline.components.transcriptcredit.CreditEntry', {
	addNewType: 'Add New Type...',
});

function EditableType({ entry, remainingTypes, onChange }) {
	const [showAddModal, toggleAddModal] = useToggle();
	const { types: creditTypes } = useStoreValue();
	const ref = useRef();
	const dismiss = () => ref.current?.dismiss();
	return (
		<>
			<Flyout.Triggered
				autoDismissOnAction
				className="transcript-credit-type-select"
				trigger={
					<div className="credit-type-select">
						{entry.creditDefinition.toString()}
						<i className="icon-chevron-down" />
					</div>
				}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				sizing={Flyout.SIZES.MATCH_SIDE}
				ref={ref}
			>
				<>
					{creditTypes?.map(option => {
						const disabled = !remainingTypes
							.filter(x => x.creditDefinition + ' ' + x.unit)
							.includes(option);

						return (
							<div
								key={option.toString()}
								className={cx('credit-type-option', {
									disabled,
									selected:
										option.toString() ===
										entry.creditDefinition.toString(),
								})}
							>
								<CreditEntryTypeOption
									option={option}
									onClick={
										disabled
											? null
											: x => (dismiss(), onChange(x))
									}
								/>
							</div>
						);
					})}
					<AddNewType
						onClick={() => (dismiss(), toggleAddModal(true))}
					/>
				</>
			</Flyout.Triggered>

			{showAddModal && (
				<Prompt.Dialog
					closeOnMaskClick
					closeOnEscape
					onBeforeDismiss={() => toggleAddModal(false)}
				>
					<AddCreditType
						onSave={newType => {
							onChange(newType);
							toggleAddModal(false);
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
			<div className="credit-type-option add-new" onClick={onClick}>
				{t('addNewType')}
			</div>
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
		<>
			<div className="credit-entry">
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
			</div>
		</>
	);
}
