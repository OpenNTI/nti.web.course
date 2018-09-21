import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {LinkTo} from '@nti/web-routing';
import {DateTime, Flyout, Layouts} from '@nti/web-commons';

import {getSemesterBadge} from '../../utils/Semester';
import Card from '../parts/Card';
import Badge from '../parts/Badge';
import CourseMenu from '../parts/CourseSettingsMenu';

import Registry from './Registry';

const {Responsive} = Layouts;

const t = scoped('course.card.type.Enrollment', {
	starting: 'preview',
	completed: 'completed'
});

@Registry.register('application/vnd.nextthought.courseware.courseinstanceenrollment')
export default class EnrollmentCard extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		onModification: PropTypes.func,
		store: PropTypes.shape({
			load: PropTypes.func
		}),
		options: PropTypes.array
	}

	attachOptionsFlyoutRef = x => this.optionsFlyout = x

	doRequestSupport = (e) => {
		e.stopPropagation();
		e.preventDefault();

		global.location.href = 'mailto:support@nextthought.com?subject=Support%20Request';
	}

	renderOptionsButton () {
		return (<div className="nti-course-card-badge black settings"><i className="icon-settings"/></div>);
	}

	renderOptions () {

		return (
			<Flyout.Triggered
				className="admin-course-options"
				trigger={this.renderOptionsButton()}
				horizontalAlign={Flyout.ALIGNMENTS.RIGHT}
				ref={this.attachOptionsFlyoutRef}
			>
				<CourseMenu course={this.props.course} doRequestSupport={this.doRequestSupport} registered />
			</Flyout.Triggered>
		);
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
					<i className="icon-clock-archive" />
					{getSemesterBadge(course)}
				</Badge>
			));
		}

		return (
			<LinkTo.Object object={course}>
				<Card
					{...otherProps}
					course={course.CatalogEntry}
					badges={badges}
					progress={progress}
					className="no-padding"
				/>
				{Responsive.isWebappContext() && this.renderOptions()}
			</LinkTo.Object>
		);
	}
}
