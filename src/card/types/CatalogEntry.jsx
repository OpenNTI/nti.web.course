import { scoped } from '@nti/lib-locale';
import { LinkTo } from '@nti/web-routing';
import { DateTime } from '@nti/web-commons';

import Card from '../parts/Card';
import Badge from '../parts/Badge';

import Registry from './Registry';

/** @typedef {import('@nti/lib-interfaces').Models.courses.CatalogEntry} CatalogEntry */

const DATE_FORMAT = DateTime.MONTH_ABBR_DAY_YEAR;

const t = scoped('course.card.type.catalogEntry', {
	administering: 'Administering',
	enrolled: 'Enrolled',
	starting: 'Starts %(date)s',
	finished: 'Finished %(date)s',
});

const Link = styled(LinkTo.Object)`
	position: relative;
	display: block;
`;

/**
 * @param {object} props
 * @param {CatalogEntry} props.course
 * @param {any} props.context
 * @param {(e: Event) => void} props.onClick
 * @returns {JSX.Element}
 */
export default function CatalogEntryType({
	course,
	context,
	onClick,
	...otherProps
}) {
	const startDate = course.getStartDate();
	const endDate = course.getEndDate();
	const now = new Date();
	const badges = [];

	if (course.IsAdmin) {
		badges.push(<Badge green>{t('administering')}</Badge>);
	} else {
		if (course.IsEnrolled) {
			badges.push(
				<Badge green>
					<i className="icon-check" />
					<span>{t('enrolled')}</span>
				</Badge>
			);
		}

		const starting = startDate && startDate > now;
		const finished = endDate && endDate < now;

		if (starting) {
			badges.push(
				<Badge blue>
					{t('starting', {
						date: DateTime.format(startDate, DATE_FORMAT),
					})}
				</Badge>
			);
		} else if (finished) {
			badges.push(
				<Badge grey>
					{t('finished', {
						date: DateTime.format(endDate, DATE_FORMAT),
					})}
				</Badge>
			);
		}
	}

	return (
		<Link object={course} context={context} onClick={onClick}>
			<Card {...otherProps} course={course} badges={badges} />
		</Link>
	);
}

Registry.register([
	'application/vnd.nextthought.courses.coursecataloglegacyentry',
	'application/vnd.nextthought.courseware.coursecataloglegacyentry',
	'application/vnd.nextthought.courses.catalogentry',
])(CatalogEntryType);
