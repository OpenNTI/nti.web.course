import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {LinkTo} from '@nti/web-routing';
import {DateTime} from '@nti/web-commons';

import {getSemesterBadge} from '../../utils/Semester';
import Card from '../parts/Card';
import Badge from '../parts/Badge';

import Registry from './Registry';

const t = scoped('course.card.type.sdministering', {
	starting: 'preview',
	completed: 'completed'
});

@Registry.register('application/vnd.nextthought.courseware.courseinstanceenrollment')
export default class EnrollmentCard extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired
	}

	render () {
		const {course, ...otherProps} = this.props;
		const startDate = course.getStartDate();
		const endDate = course.getEndDate();
		const completed = course.CourseProgress && course.CourseProgress.Completed;
		const progress = course.CourseProgress && course.CourseProgress.PercentageProgress;
		const preview = course.CatalogEntry.Preview;
		const now = new Date();
		const badges = [];
		const starting = startDate && startDate > now;
		const finished = endDate && endDate < now;

		if (preview) {
			badges.push((
				<Badge orange>
					{t('starting')}
				</Badge>
			));
		}

		if(completed) {
			badges.push((
				<Badge green>
					<i className="icon-check completed-check"/>
					<span>{t('completed')}</span>
				</Badge>
			));
		}

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
					progress={progress}
				/>
			</LinkTo.Object>
		);
	}
}
