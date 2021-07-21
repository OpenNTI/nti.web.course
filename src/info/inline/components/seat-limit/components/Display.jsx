import { Text } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

const t = scoped(
	'course.info.inline.components.seat-limit.components.Display',
	{
		full: {
			enrollment: "We're sorry, it looks like the course is full.",
			admin: '%(used)s of %(max)s seats filled.',
		},
		remaining: '%(remaining)s of %(max)s seats remaining.',
		noLimit: 'Unlimited',
	}
);

const SeatLimitText = Text.Translator(t);

export default styled(SeatLimitText.Base).attrs(({ catalogEntry, admin }) => {
	const { SeatLimit } = catalogEntry;
	const { UsedSeats: used, MaxSeats: max } = SeatLimit ?? {};

	const full = SeatLimit && used >= max;
	const open = SeatLimit && !full;

	let localeKey = 'noLimit';
	let localeData = null;

	if (full && admin) {
		localeKey = 'full.admin';
		localeData = { used, max };
	} else if (full) {
		localeKey = 'full.enrollment';
	} else if (open) {
		localeKey = 'remaining';
		localeData = { remaining: Math.max(0, max - used), max };
	}

	return {
		notSet: !full && !open,
		admin,
		open,
		full,

		localeKey,
		with: localeData,
	};
})`
	font-size: 0.875rem;
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
