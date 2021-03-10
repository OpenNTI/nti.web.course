import './EnrollmentListItem.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Presentation, DateTime } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import { Admin as EnrollmentAdmin } from '../enrollment';

const t = scoped('course.listing.EnrollmentListItem', {
	completed: 'Completed on %(date)s',
});

const DATE_FORMAT = DateTime.MONTH_NAME_DAY_YEAR;

export default class CourseEnrollmentListItem extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		enrollment: PropTypes.object.isRequired,
		onChange: PropTypes.func,
	};

	render() {
		const { enrollment, className, ...otherProps } = this.props;

		return (
			<div
				className={cx('nti-course-enrollment-list-item', className)}
				{...otherProps}
			>
				{this.renderIcon(enrollment)}
				{this.renderMeta(enrollment)}
				{this.renderControls(enrollment)}
			</div>
		);
	}

	renderIcon(enrollment) {
		const { CatalogEntry } = enrollment;

		return (
			<Presentation.Asset contentPackage={CatalogEntry} type="landing">
				<img className="course-enrollment-icon" />
			</Presentation.Asset>
		);
	}

	renderMeta(enrollment) {
		const { label, title } = enrollment.getPresentationProperties();

		return (
			<div className="course-enrollment-meta">
				<div className="label">{label}</div>
				<div className="title">{title}</div>
				{enrollment.isAdministrative || !enrollment.CourseProgress
					? this.renderDates(enrollment)
					: this.renderProgress(enrollment)}
			</div>
		);
	}

	renderDates() {}

	renderProgress(enrollment) {
		const { CourseProgress } = enrollment;
		const { PercentageProgress } = CourseProgress || {};
		const CompletedDate =
			CourseProgress && CourseProgress.getCompletedDate();

		return (
			<div className="progress-container">
				{CompletedDate && (
					<div className="completed">
						<i className="icon-check" />
						<span className="date">
							{t('completed', {
								date: DateTime.format(
									CompletedDate,
									DATE_FORMAT
								),
							})}
						</span>
					</div>
				)}
				{!CompletedDate && (
					<progress max={1} value={PercentageProgress || 0} />
				)}
			</div>
		);
	}

	renderControls(enrollment) {
		if (enrollment.isAdministrative || !enrollment.hasLink('CourseDrop')) {
			return null;
		}

		const { onChange } = this.props;

		return (
			<div className="course-enrollment-controls">
				<EnrollmentAdmin.Prompt.Trigger
					enrollment={enrollment}
					onChange={onChange}
				>
					<i className="icon-edit" />
				</EnrollmentAdmin.Prompt.Trigger>
			</div>
		);
	}
}
