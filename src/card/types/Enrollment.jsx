import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { LinkTo } from '@nti/web-routing';
import { DateTime, Flyout, Layouts } from '@nti/web-commons';

import { getSemesterBadge } from '../../utils/Semester';
import Card from '../parts/Card';
import Badge from '../parts/Badge';
import CourseMenu from '../parts/CourseSettingsMenu';
import { RequirementDetails } from '../../pass-fail';

import Registry from './Registry';

const { Responsive } = Layouts;

const t = scoped('course.card.type.Enrollment', {
	starting: 'preview',
	completed: 'completed',
	viewDetails: 'View Details',
});

const Link = styled(LinkTo.Object)`
	position: relative;
	display: inline-block;
`;

export default class EnrollmentCard extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		onModification: PropTypes.func,
	};

	attachOptionsFlyoutRef = x => (this.optionsFlyout = x);

	state = {};

	doRequestSupport = e => {
		e.stopPropagation();
		e.preventDefault();

		global.location.href =
			'mailto:support@nextthought.com?subject=Support%20Request';
	};

	renderOptionsButton() {
		return (
			<div className="nti-course-card-badge black settings">
				<i className="icon-settings" />
			</div>
		);
	}

	renderOptions() {
		return (
			<Flyout.Triggered
				className="admin-course-options"
				trigger={this.renderOptionsButton()}
				horizontalAlign={Flyout.ALIGNMENTS.RIGHT}
				ref={this.attachOptionsFlyoutRef}
			>
				<CourseMenu
					course={this.props.course}
					doRequestSupport={this.doRequestSupport}
					registered
				/>
			</Flyout.Triggered>
		);
	}

	viewDetails = e => {
		e.stopPropagation();
		e.preventDefault();

		this.setState({ showDetails: true });
	};

	render() {
		const { course, ...otherProps } = this.props;
		const { showDetails } = this.state;
		const startDate = course.getStartDate();
		const endDate = course.getEndDate();
		const completed =
			course.CourseProgress && course.CourseProgress.Completed;
		const progress =
			course.CourseProgress && course.CourseProgress.PercentageProgress;
		const preview = course.CatalogEntry.Preview;
		const now = new Date();
		const badges = [];
		const starting = startDate && startDate > now;
		const finished = endDate && endDate < now;

		if (preview) {
			badges.push(<Badge orange>{t('starting')}</Badge>);
		}

		if (completed) {
			const CompletedItem =
				(course.CourseProgress || {}).CompletedItem || {};

			if (CompletedItem.Success) {
				badges.push(
					<Badge green>
						<i className="icon-check-10 completed-check" />
						<span>{t('completed')}</span>
					</Badge>
				);
			} else {
				badges.push(
					<Badge white>
						<div onClick={this.viewDetails}>
							<span className="warning" />
							<span>{t('viewDetails')}</span>
						</div>
					</Badge>
				);
			}
		}

		if (starting) {
			badges.push(<Badge blue>{DateTime.format(startDate)}</Badge>);
		} else if (finished) {
			badges.push(
				<Badge black>
					<i className="icon-clock-archive" />
					{getSemesterBadge(course)}
				</Badge>
			);
		}

		return (
			<Link object={course}>
				<Card
					{...otherProps}
					course={course.CatalogEntry}
					badges={badges}
					progress={progress}
					className="no-padding"
				/>
				{Responsive.isWebappContext() && this.renderOptions()}
				{showDetails && (
					<RequirementDetails
						course={{ PreferredAccess: course }}
						onBeforeDismiss={() =>
							this.setState({ showDetails: false })
						}
					/>
				)}
			</Link>
		);
	}
}

Registry.register(
	'application/vnd.nextthought.courseware.courseinstanceenrollment'
)(EnrollmentCard);
