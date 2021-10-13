import { useCallback } from 'react';
import cx from 'classnames';

import { Input } from '@nti/web-commons';
import { SelectMenu } from '@nti/web-core';
import { scoped } from '@nti/lib-locale';

import Store from './Store';

const t = scoped('course.admin-tools.advanced.completion.Certificates', {
	none: 'None',
	default: 'Default Certificate',
});

const getText = key => (t.isMissing(key) ? key : t(key));

const CertSelectionContainer = styled.div`
	box-shadow: inset 0 -1px 0 0 rgba(226, 226, 226, 0.5);
	padding-bottom: 20px;
`;

const CertSelect = styled(SelectMenu)`
	position: relative;
	right: var(--padding-md);
`;

export function CompletionCertificates({
	onChange,
	disabled: disabledProp,
	certificateRendererName,
	offersCompletionCertificate,
	label,
}) {
	const awards = Boolean(offersCompletionCertificate);
	const disabled = disabledProp || !onChange;

	const toggle = useCallback(() => {
		onChange({
			offersCompletionCertificate: !awards,
		});
	}, [onChange, offersCompletionCertificate]);

	const { certificateRenderers } = Store.useValue();
	const multiple = certificateRenderers?.length > 1;
	const selectedRenderer = certificateRendererName ?? 'default';

	const changeRenderer = useCallback(
		renderer => {
			onChange({
				offersCompletionCertificate: true,
				certificateRendererName: renderer,
			});
		},
		[onChange]
	);

	return (
		<>
			<div
				className={cx('completion-control', 'no-border', { disabled })}
			>
				<div className="label">{label}</div>
				<div className="control">
					<Input.Toggle
						disabled={disabled}
						value={awards}
						data-testid="certificate-policy-switch"
						onChange={toggle}
					/>
				</div>
			</div>
			<CertSelectionContainer className={cx('certificate-selection')}>
				{awards && multiple && (
					<CertSelect
						data-testid="certificate-select-menu"
						variant="link"
						ph="md"
						disabled={disabled}
						value={selectedRenderer}
						options={certificateRenderers}
						onChange={changeRenderer}
						getText={getText}
					/>
				)}
			</CertSelectionContainer>
		</>
	);
}
