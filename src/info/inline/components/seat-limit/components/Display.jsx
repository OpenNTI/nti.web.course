import { Text } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

const t = scoped(
	'course.info.inline.components.seat-limit.components.Display',
	{
		full: "We're sorry, it looks like the course is full.",
		open: '%(remaining)s of %(max)s seats remaining.',
		noLimit: 'Unlimited',
	}
);

const SeatLimitText = Text.Translator(t);

export default styled(SeatLimitText.Base).attrs(({ catalogEntry, admin }) => {
	const { SeatLimit } = catalogEntry;
	const { UsedSeats: used, MaxSeats: max } = SeatLimit ?? {};

	const full = SeatLimit && used >= max;
	const open = SeatLimit && !full;

	return {
		notSet: !full && !open,
		admin,
		open,
		full,

		localeKey: full ? 'full' : open ? 'open' : 'noLimit',
		with: open ? { remaining: Math.max(0, max - used), max } : null,
	};
})`
	font-size: 0.75rem;
	font-style: italic;
	color: var(--primary-blue);

	&.notSet:not(.admin) {
		display: none;
	}

	&.notSet.admin {
		color: var(--secondary-grey);
	}

	&.full {
		color: var(--primary-red);
	}
`;
