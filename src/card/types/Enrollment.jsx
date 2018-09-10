import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {LinkTo} from '@nti/web-routing';
import { getService } from '@nti/web-client';
import {DateTime, Prompt, Flyout} from '@nti/web-commons';

import {getSemesterBadge} from '../../utils/Semester';
import Card from '../parts/Card';
import Badge from '../parts/Badge';
import CourseMenu from '../parts/CourseSettingsMenu';

import Registry from './Registry';

const t = scoped('course.card.type.Enrollment', {
	starting: 'preview',
	completed: 'completed',
	confirmDrop: 'Dropping %(course)s will remove it from your library and you will no longer have access to the course materials.'
});

@Registry.register('application/vnd.nextthought.courseware.courseinstanceenrollment')
export default class EnrollmentCard extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		onModification: PropTypes.func
	}

	attachOptionsFlyoutRef = x => this.optionsFlyout = x

	doRequestSupport = (e) => {
		e.stopPropagation();
		e.preventDefault();

		global.location.href = 'mailto:support@nextthought.com?subject=Support%20Request';
	}

	async getEnrollmentService () {
		const service = await getService();
		return service.getEnrollment();
	}

	doDrop = (e) => {
		const { course, onModification } = this.props;

		e.stopPropagation();
		e.preventDefault();

		Prompt.areYouSure(t('confirmDrop', {course: course.CatalogEntry.title})).then(() => {
			this.setState( { loading: true }, () => {
				this.getEnrollmentService().then((enrollmentService) => {
					return enrollmentService.dropCourse(course.CatalogEntry.CourseNTIID);
				}).then(() => {
					onModification && onModification();
				}).catch((err) => {
					console.error(err); //eslint-disable-line
					// timeout here because there is a 500 ms delay on the areYouSure dialog being dismissed
					// so if the dropping fails too fast, we risk automatically dismissing this alert dialog
					// when the areYouSure dialog is dismissed
					setTimeout(() => {
						Prompt.alert('Error dropping this course');
					}, 505);
				});
			});
		});
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
				<CourseMenu course={this.props.course} doRequestSupport={this.doRequestSupport} doDrop={this.doDrop} registered />
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
				{this.renderOptions()}
			</LinkTo.Object>
		);
	}
}
