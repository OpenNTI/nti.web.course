import cx from 'classnames';

import { Input, List } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import Store from './Store';

const t = scoped('course.admin-tools.advanced.completion.Certificates', {
	none: 'None',
});

// const Thumbnail = styled('img')`
// 	width: 140px;
// 	aspect-ratio: 1.29;
// 	object-fit: cover;
// `;

const NO_RENDERER = undefined;

const Radio = styled('input').attrs({
	type: 'radio',
	name: 'template',
})`
	visibility: hidden;
	position: absolute;
`;

const CertList = styled(List.Unadorned)`
	display: grid;
	grid-auto-columns: minmax(100px, 160px);
	grid-auto-flow: column;
`;

const CertificateRendererItem = styled('label')`
	display: flex;
	flex-direction: column-reverse;
`;

function CertificateRenderer({ item, onChange, selected }) {
	return (
		<CertificateRendererItem>
			<Radio
				checked={selected}
				value={item}
				onChange={() => onChange(item)}
			/>
			<span>{item || t('none')}</span>
		</CertificateRendererItem>
	);
}

function CertificateRenderers({ items, onChange, value }) {
	return !items?.length ? null : (
		<CertList>
			{[NO_RENDERER, ...items].map(item => (
				<li key={item || 'none'}>
					<CertificateRenderer
						item={item}
						onChange={onChange}
						selected={value === item}
					/>
				</li>
			))}
		</CertList>
	);
}

const Container = styled('div').attrs(props => ({
	...props,
	className: cx('completion-control', props.disabled),
}))`
	/* && to increase specificity */
	&& {
		flex-direction: column;
		align-items: flex-start;
	}
`;

export function CompletionCertificates({
	onChange,
	certificateRendererName,
	offersCompletionCertificate,
	label,
}) {
	const disabled = !onChange;
	const { certificateRenderers } = Store.useValue();

	const useRendererSelect = true; //certificateRenderers?.length > 1;
	const onCertRendererChange = renderer => {
		onChange({
			offersCompletionCertificate: !!renderer,
			certificateRendererName: renderer,
		});
	};

	return (
		<Container disabled={disabled}>
			<div>
				<div className="label">{label}</div>
				<div className="control">
					{useRendererSelect ? (
						<CertificateRenderers
							value={
								offersCompletionCertificate
									? certificateRendererName
									: NO_RENDERER
							}
							items={certificateRenderers}
							onChange={onCertRendererChange}
						/>
					) : (
						<Input.Toggle
							disabled={disabled}
							value={offersCompletionCertificate}
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
		</Container>
	);
}
