import React, { useCallback } from 'react';

import { scoped } from '@nti/lib-locale';
import { Radio, Input } from '@nti/web-commons';

import Container from './components/Container';
import RadioGroup from './components/RadioGroup';

const RadioGroupName = 'course-seat-limit';

const t = scoped('course.info.inline.components.seat-limit.components.Edit', {
	unlimited: 'Unlimited',
	limited: 'Limit the available seats',
});

export default function SeatLimitEditor({
	catalogEntry,
	onValueChange,
	error,
}) {
	const [pending, setPending] = React.useState(null);

	const { SeatLimit } = pending ?? catalogEntry;
	const { MaxSeats: max } = SeatLimit ?? {};

	const limited = pending ? pending.selected === 'limited' : max != null;

	const updatePending = useCallback(
		pending => (
			setPending(pending), onValueChange('PendingSeatLimit', pending)
		),
		[setPending, onValueChange]
	);

	const setUnlimited = useCallback(
		() => updatePending({ SeatLimit: null, selected: 'unlimited' }),
		[updatePending]
	);

	const setLimited = useCallback(
		() =>
			updatePending({
				SeatLimit: {
					MaxSeats: catalogEntry?.SeatLimit?.MaxSeats ?? 100,
				},
				selected: 'limited',
			}),
		[updatePending, catalogEntry]
	);

	const setSeatLimit = useCallback(
		max =>
			updatePending({
				SeatLimit: { MaxSeats: max },
				selected: 'limited',
			}),
		[updatePending]
	);

	return (
		<Container>
			<RadioGroup>
				<Radio
					checked={!limited}
					label={t('unlimited')}
					name={RadioGroupName}
					onChange={setUnlimited}
				/>
				<Radio
					checked={limited}
					label={t('limited')}
					name={RadioGroupName}
					onChange={setLimited}
				>
					<Input.Number value={max} onChange={setSeatLimit} />
				</Radio>
			</RadioGroup>
		</Container>
	);
}
