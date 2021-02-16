import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { LinkTo } from '@nti/web-routing';
import { DateTime } from '@nti/web-commons';

import Card from '../parts/Card';
import Badge from '../parts/Badge';

import Registry from './Registry';

const DATE_FORMAT = DateTime.MONTH_ABBR_DAY_YEAR;

const t = scoped('course.card.type.catalogEntry', {
	administering: 'Administering',
	enrolled: 'Enrolled',
	starting: 'Starts %(date)s',
	finished: 'Finished %(date)s',
});

export default class CatalogEntryType extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		onClick: PropTypes.func,
	};

	render() {
		const { course, onClick, ...otherProps } = this.props;
		const { IsAdmin: isAdmin, IsEnrolled: isEnrolled } = course;
		const startDate = course.getStartDate();
		const endDate = course.getEndDate();
		const now = new Date();
		const badges = [];

		if (isAdmin) {
			badges.push(<Badge green>{t('administering')}</Badge>);
		} else {
			if (isEnrolled) {
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
			<LinkTo.Object object={course} onClick={onClick}>
				<Card {...otherProps} course={course} badges={badges} />
			</LinkTo.Object>
		);
	}
}

Registry.register([
	'application/vnd.nextthought.courses.coursecataloglegacyentry',
	'application/vnd.nextthought.courseware.coursecataloglegacyentry',
	'application/vnd.nextthought.courses.catalogentry',
])(CatalogEntryType);
