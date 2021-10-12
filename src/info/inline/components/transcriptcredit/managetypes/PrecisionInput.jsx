import { Select } from '@nti/web-commons';

export const getLabel = precision => {
	const { locale } = new Intl.NumberFormat().resolvedOptions();
	const formatter = new Intl.NumberFormat(locale, {
		minimumFractionDigits: precision,
		maximumFractionDigits: precision,
	});
	return formatter.format(0);
};

export function PrecisionInput({ onChange, ...props }) {
	const change = e => {
		onChange?.(parseInt(e.target.selectedOptions[0]?.value, 10));
	};
	return (
		<Select
			{...props}
			onChange={change}
			css={css`
				max-width: 75px;
				text-align: left;
				line-height: 2rem;
				border-radius: 2px;
				box-shadow: 0 0 0 1px var(--border-grey-light);
				background-color: var(--panel-background);
				color: var(--secondary-grey);
			`}
		>
			<option value={1}>{getLabel(1)}</option>
			<option value={2}>{getLabel(2)}</option>
		</Select>
	);
}
