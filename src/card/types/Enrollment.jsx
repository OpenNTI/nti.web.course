import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { LinkTo } from '@nti/web-routing';
import { DateTime, Flyout, Layouts } from '@nti/web-commons';

import { getSemesterBadge } from '../../utils/Semester';
import ArchivedIcon from '../parts/ArchivedIcon';
import Badge from '../parts/Badge';
import Card from '../parts/Card';
import CompletedCheck from '../parts/CompletedCheckIcon';
import Settings from '../parts/SettingsIcon';
import CourseMenu from '../../SettingsMenu';
import { RequirementDetails } from '../../pass-fail';

import { EnrollmentDropListener } from './EnrollmentDropListener';
import Registry from './Registry';

const { Responsive } = Layouts;

const t = scoped('course.card.type.Enrollment', {
	starting: 'preview',
	completed: 'completed',
	viewDetails: 'View Details',
});

const Link = styled(LinkTo.Object)`
	position: relative;
	display: block;
`;

export default class EnrollmentCard extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		context: PropTypes.any,
		onModification: PropTypes.func,
	};

	attachOptionsFlyoutRef = x => (this.optionsFlyout = x);

	state = {};

	renderOptionsButton() {
		return <Settings />;
	}

	renderOptions() {
		return (
			<Flyout.Triggered
				className="admin-course-options"
				trigger={this.renderOptionsButton()}
				horizontalAlign={Flyout.ALIGNMENTS.RIGHT}
				ref={this.attachOptionsFlyoutRef}
				autoDismissOnAction
			>
				<CourseMenu course={this.props.course} registered />
			</Flyout.Triggered>
		);
	}

	viewDetails = e => {
		e.stopPropagation();
		e.preventDefault();

		this.setState({ showDetails: true });
	};

	render() {
		const { course, context, ...otherProps } = this.props;
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
						<CompletedCheck />
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
				<Badge grey>
					<ArchivedIcon />
					{getSemesterBadge(course)}
				</Badge>
			);
		}

		return (
			<EnrollmentDropListener course={course}>
				<Link object={course} context={context}>
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
			</EnrollmentDropListener>
		);
	}
}

Registry.register(
	'application/vnd.nextthought.courseware.courseinstanceenrollment'
)(EnrollmentCard);
