import { Input } from '@nti/web-commons';

export const getLabel = precision => {
	const { locale } = new Intl.NumberFormat().resolvedOptions();
	const formatter = new Intl.NumberFormat(locale, {
		minimumFractionDigits: precision,
		maximumFractionDigits: precision,
	});
	return formatter.format(0);
};

export function PrecisionInput(props) {
	return (
		<Input.Select
			{...props}
			css={css`
				max-width: 75px;
				text-align: left;
			`}
		>
			<Input.Select.Option value={1}>{getLabel(1)}</Input.Select.Option>
			<Input.Select.Option value={2}>{getLabel(2)}</Input.Select.Option>
		</Input.Select>
	);
}
