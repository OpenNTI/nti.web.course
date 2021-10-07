import { Input } from '@nti/web-commons';

export function PrecisionInput(props) {
	return (
		<Input.Select
			{...props}
			css={css`
				max-width: 75px;
				text-align: left;
			`}
		>
			<Input.Select.Option value={1}>1</Input.Select.Option>
			<Input.Select.Option value={2}>2</Input.Select.Option>
		</Input.Select>
	);
}
