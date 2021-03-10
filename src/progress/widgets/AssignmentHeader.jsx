import './AssignmentHeader.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { Flyout, DateTime } from '@nti/web-commons';
import { CircularProgress } from '@nti/web-charts';

const t = scoped('course.components.ProgressCard', {
	published: 'Published',
	unpublished: 'Unpublished',
	due: 'Due %(dueDate)s',
	edit: 'Edit',
	avgGrade: 'Avg Grade',
	avgDuration: 'Avg Duration',
	onTime: 'On Time',
	grade: '%(letter)s - %(grade)s',
	duration: '%(hours)s hr. %(minutes)s min.',
});

// MOCK DATA
const PROGRESS = 75;
const TITLE = 'Mountainous Landscapes in Asia';
const AVG_GRADE = 88;
const AVG_DURATION = 95;
const ON_TIME_PCT = 60;
const DUE_DATE = new Date('10/01/2018');
const PUBLISHED = true;

export default class AssignmentHeader extends React.Component {
	static propTypes = {
		completed: PropTypes.number,
		total: PropTypes.number,
	};

	attachPublishFlyoutRef = x => (this.publishFlyout = x);
	attachDueDateFlyoutRef = x => (this.dueDateFlyout = x);

	renderPublishTrigger() {
		const label = PUBLISHED ? t('published') : t('unpublished');

		return (
			<div className="trigger">
				<span className="value">{label}</span>
				<i className="icon-chevron-down" />
			</div>
		);
	}

	renderPublishControl() {
		return (
			<Flyout.Triggered
				className="course-progress-assignment-header-publish-flyout"
				trigger={this.renderPublishTrigger()}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				sizing={Flyout.SIZES.MATCH_SIDE}
				ref={this.attachPublishFlyoutRef}
			>
				<div>
					<div
						className="assignment-control-option"
						onClick={this.publish}
					>
						Publish
					</div>
				</div>
			</Flyout.Triggered>
		);
	}

	renderDueDateTrigger() {
		const dueDate = DateTime.format(
			DUE_DATE,
			DateTime.WEEKDAY_ABBR_MONTH_NAME_ORDINAL_DAY
		);

		return (
			<div className="trigger">
				<span className="value">{t('due', { dueDate })}</span>
				<i className="icon-chevron-down" />
			</div>
		);
	}

	renderDueDateControl() {
		return (
			<Flyout.Triggered
				className="course-progress-assignment-header-due-date-flyout"
				trigger={this.renderDueDateTrigger()}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				sizing={Flyout.SIZES.MATCH_SIDE}
				ref={this.attachDueDateFlyoutRef}
			>
				<div>
					<div
						className="assignment-control-option"
						onClick={this.publish}
					>
						Change
					</div>
				</div>
			</Flyout.Triggered>
		);
	}

	renderControls() {
		return (
			<div className="controls">
				<CircularProgress
					value={PROGRESS}
					width={56}
					height={56}
					showPctSymbol={false}
					lineThickness={5}
					deficitFillColor="#eaeaea"
				/>
				<div className="header-info">
					<div className="title">{TITLE}</div>
					<div className="publish-controls">
						{this.renderPublishControl()}
						{this.renderDueDateControl()}
					</div>
				</div>
				<div className="button-secondary">{t('edit')}</div>
			</div>
		);
	}

	renderStatistic(label, value) {
		return (
			<div className="statistic">
				<div className="stat-label">{label}</div>
				<div className="stat-value">{value}</div>
			</div>
		);
	}

	renderStatistics() {
		const letter = this.getGradeLetter(AVG_GRADE);
		const hours = Math.floor(AVG_DURATION / 60);
		const minutes = AVG_DURATION % 60;

		return (
			<div className="statistics">
				{this.renderStatistic(
					t('avgGrade'),
					t('grade', { grade: AVG_GRADE, letter }) + '%'
				)}
				{this.renderStatistic(
					t('avgDuration'),
					t('duration', { hours, minutes })
				)}
				{this.renderStatistic(t('onTime'), ON_TIME_PCT)}
			</div>
		);
	}

	getGradeLetter(value) {
		if (value >= 90) {
			return 'A';
		} else if (value >= 80) {
			return 'B';
		} else if (value >= 70) {
			return 'C';
		} else if (value >= 60) {
			return 'D';
		} else {
			return 'F';
		}
	}

	render() {
		return (
			<div className="course-progress-assignment-header">
				{this.renderControls()}
				{this.renderStatistics()}
			</div>
		);
	}
}
