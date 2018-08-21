import React from 'react';
import PropTypes from 'prop-types';
import {LinkTo} from '@nti/web-routing';
import {DateTime} from '@nti/web-commons';

import {getSemesterBadge} from '../../utils/Semester';
import Card from '../parts/Card';
import Badge from '../parts/Badge';

import Registry from './Registry';

@Registry.register('application/vnd.nextthought.courseware.courseinstanceenrollment')
export default class EnrollmentCard extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired
	}

	render () {
		const {course, ...otherProps} = this.props;
		const startDate = course.getStartDate();
		const endDate = course.getEndDate();
		const now = new Date();
		const badges = [];

		const starting = startDate && startDate > now;
		const finished = endDate && endDate < now;

		if (starting) {
			badges.push((
				<Badge blue>
					{DateTime.format(startDate)}
				</Badge>
			));
		} else if (finished) {
			badges.push((
				<Badge black>
					{getSemesterBadge(course)}
				</Badge>
			));
		}

		badges.push((
			<Badge black settings />
		));

		return (
			<LinkTo.Object object={course}>
				<Card
					{...otherProps}
					course={course.CatalogEntry}
					badges={badges}
				/>
			</LinkTo.Object>
		);
	}
}
