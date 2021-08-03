import cx from 'classnames';

import { Input } from '@nti/web-commons';

import Store from './Store';

function Certificates({ onChange, policy, label }) {
	const disabled = !onChange;
	const className = cx('completion-control', { disabled });

	return (
		<div className={className}>
			<div className="label">{label}</div>
			<div className="control">
				<Input.Toggle
					disabled={disabled}
					value={policy}
					onChange={onChange}
				/>
			</div>
		</div>
	);
}

export const CompletionCertificates = Store.connect([
	'loading',
	'completable',
	'certificationPolicy',
	'percentage',
	'disabled',
	'defaultRequiredDisabled',
	'defaultRequirables',
	'completableToggleDisabled',
	'updateDisabled',
	'error',
])(Certificates);
