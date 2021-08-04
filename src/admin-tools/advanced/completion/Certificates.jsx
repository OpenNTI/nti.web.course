import cx from 'classnames';

import { Input, List } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import Store from './Store';

const t = scoped('course.admin-tools.advanced.completion.Certificates', {
	none: 'None',
});

const Thumbnail = styled('img')`
	width: 140px;
	aspect-ratio: 1.29;
	object-fit: cover;
`;

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

const TemplateItem = styled('label')`
	display: flex;
	flex-direction: column-reverse;
`;

function Template({
	item: { Title = t('none'), NTIID, thumbnailUrl } = {},
	onChange,
}) {
	return (
		<TemplateItem>
			<Radio value={NTIID} onChange={onChange} />
			<span>{Title}</span>
			<Thumbnail src={thumbnailUrl} />
		</TemplateItem>
	);
}

function Templates({ onChange }) {
	const { certificateTemplates: items } = Store.useValue();

	return !items?.length ? null : (
		<CertList>
			<li>
				<Template onChange={onChange} />
			</li>
			{items.map(item => (
				<li key={item.NTIID}>
					<Template item={item} onChange={onChange} />
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

export function CompletionCertificates({ onChange, policy, label }) {
	const disabled = !onChange;

	return (
		<Container disabled={disabled}>
			<div>
				<div className="label">{label}</div>
				<div className="control">
					<Input.Toggle
						disabled={disabled}
						value={policy}
						onChange={onChange}
					/>
				</div>
			</div>
			<Templates onChange={e => console.log(e.target.value)} />
		</Container>
	);
}
