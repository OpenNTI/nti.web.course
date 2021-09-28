import './AddCreditType.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { useStoreValue } from '@nti/lib-store';
import { scoped } from '@nti/lib-locale';
import { Input, DialogButtons, Panels } from '@nti/web-commons';
import { useReducerState } from '@nti/web-core';

import { useNoConflictResolver } from './managetypes/ManageCreditTypes';

const t = scoped(
	'course.info.inline.components.transcriptcredit.AddCreditType',
	{
		addNewType: 'Add New Type...',
		title: 'Add New Credit Type',
		done: 'Save',
		alreadyExists: 'This credit type already exists',
	}
);

AddCreditType.propTypes = {
	onSave: PropTypes.func,
	onDismiss: PropTypes.func,
};
export default function AddCreditType({ onSave: _onSave, onDismiss }) {
	const [{ unit, type, precision }, setState] = useReducerState({
		unit: '',
		type: '',
		precision: 2,
	});
	const { saveCreditType, error } = useStoreValue();

	useNoConflictResolver();

	const onSave = async () => {
		const result = await saveCreditType({ type, unit, precision });
		if (result) {
			_onSave?.(result);
			onDismiss?.();
		}
	};

	return (
		<div className="add-credit-type">
			<div className="title">
				<Panels.TitleBar title={t('title')} iconAction={onDismiss} />
			</div>
			<div className="content">
				{error && <div className="error">{error.message ?? error}</div>}
				<div className="header-row">
					<div className="header-text">Type</div>
					<div className="header-text">Unit</div>
				</div>
				<Input.Text
					value={type}
					className="type"
					onChange={v => setState({ type: v })}
				/>
				<Input.Text
					value={unit}
					className="unit"
					onChange={v => setState({ unit: v })}
				/>
				<Input.Number
					value={precision}
					className="precision"
					onChange={v => setState({ precision: v })}
				/>
			</div>
			<DialogButtons buttons={[{ label: t('done'), onClick: onSave }]} />
		</div>
	);
}
