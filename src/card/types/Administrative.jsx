import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {LinkTo} from '@nti/web-routing';
import { getService } from '@nti/web-client';
import {DateTime, Prompt, Flyout, Layouts} from '@nti/web-commons';

import {getSemesterBadge} from '../../utils/Semester';
import Card from '../parts/Card';
import Badge from '../parts/Badge';
import CourseMenu from '../parts/CourseSettingsMenu';

import Registry from './Registry';

const {Responsive} = Layouts;

const t = scoped('course.card.type.administering', {
	starting: 'preview',
	confirmDelete: 'Do you want to delete this course?'
});

@Registry.register('application/vnd.nextthought.courseware.courseinstanceadministrativerole')
export default class Administrative extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		onModification: PropTypes.func
	}

	attachOptionsFlyoutRef = x => this.optionsFlyout = x

	deleteCourse = (e) => {
		const { course, onModification } = this.props;

		e.stopPropagation();
		e.preventDefault();

		Prompt.areYouSure(t('confirmDelete')).then(() => {
			this.setState( { loading: true }, () => {
				getService().then((service) => {
					return service.getObject(course.CatalogEntry.CourseNTIID).then((courseInstance) => {
						return courseInstance.delete();
					});
				}).then(() => {
					onModification && onModification();
				}).catch((err) => {
					console.error(err); //eslint-disable-line
					// timeout here because there is a 500 ms delay on the areYouSure dialog being dismissed
					// so if the deletion fails too fast, we risk automatically dismissing this alert dialog
					// when the areYouSure dialog is dismissed
					setTimeout(() => {
						Prompt.alert('You don\'t have permission to delete this course');
					}, 505);
				});
			});
		});
	};

	doRequestSupport = (e) => {
		e.stopPropagation();
		e.preventDefault();

		global.location.href = 'mailto:support@nextthought.com?subject=Support%20Request';
	}

	doEdit = () => {
		const { onEdit, course } = this.props;

		onEdit && this.context.router.routeTo.object(course);
	}

	doExport = (e) => {
		e.stopPropagation();
		e.preventDefault();

		const { course } = this.props;

		if(course.CatalogEntry.hasLink('Export')) {
			this.optionsFlyout && this.optionsFlyout.dismiss();

			global.location.href = course.CatalogEntry.getLink('Export');
		}
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
				<CourseMenu course={this.props.course} doEdit={this.doEdit} doExport={this.doExport} doDelete={this.deleteCourse} doRequestSupport={this.doRequestSupport} registered admin />
			</Flyout.Triggered>
		);
	}

	render () {
		const {course, ...otherProps} = this.props;
		const startDate = course.CatalogEntry.getStartDate();
		const endDate = course.CatalogEntry.getEndDate();
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
					className="no-padding"
				/>
				{Responsive.isWebappContext() && this.renderOptions()}
			</LinkTo.Object>
		);
	}
}
