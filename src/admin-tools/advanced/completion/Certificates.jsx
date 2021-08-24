import cx from 'classnames';

import { Input } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import { SelectMenu } from '@nti/web-core';

import Store from './Store';

const t = scoped('course.admin-tools.advanced.completion.Certificates', {
	none: 'None',
	default: 'Default',
});

const getText = key => (t.isMissing(key) ? key : t(key));

const NO_RENDERER = 'none';

export function CompletionCertificates({
	onChange,
	disabled: disabledProp,
	certificateRendererName,
	offersCompletionCertificate,
	label,
}) {
	const disabled = disabledProp || !onChange;
	const { certificateRenderers } = Store.useValue();

	const useRendererSelect = certificateRenderers?.length > 1;
	const onCertRendererChange = renderer => {
		const value = renderer === NO_RENDERER ? undefined : renderer;
		onChange({
			offersCompletionCertificate: !!value,
			certificateRendererName: value,
		});
	};

	return (
		<div className={cx('completion-control', { disabled })}>
			<div className="label">{label}</div>
			<div className="control">
				{useRendererSelect ? (
					<SelectMenu
						data-testid="certificate-select-menu"
						variant="medium"
						value={
							offersCompletionCertificate
								? certificateRendererName
								: NO_RENDERER
						}
						disabled={disabled}
						options={[NO_RENDERER, ...certificateRenderers]}
						onChange={onCertRendererChange}
						getText={getText}
					/>
				) : (
					<Input.Toggle
						disabled={disabled}
						value={offersCompletionCertificate}
						data-testid="certificate-policy-switch"
						onChange={() =>
							onChange({
								offersCompletionCertificate:
									!offersCompletionCertificate,
							})
						}
					/>
				)}
			</div>
		</div>
	);
}
