import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { LinkTo } from '@nti/web-routing';
import { DateTime, Flyout, Layouts, Loading } from '@nti/web-commons';

import { getSemesterBadge } from '../../utils/Semester';
import ArchivedIcon from '../parts/ArchivedIcon';
import Badge from '../parts/Badge';
import Card from '../parts/Card';
import CompletedCheck from '../parts/CompletedCheckIcon';
import Settings from '../parts/SettingsIcon';
import CourseMenu from '../../SettingsMenu';
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
	display: block;
`;

class EnrollmentCard extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		onModification: PropTypes.func,
		onBeforeDrop: PropTypes.func,
		onAfterDrop: PropTypes.func,
	};

	attachOptionsFlyoutRef = x => (this.optionsFlyout = x);

	state = {};

	renderOptionsButton() {
		return <Settings />;
	}

	renderOptions() {
		const { course } = this.props;
		return (
			<Flyout.Triggered
				className="admin-course-options"
				trigger={this.renderOptionsButton()}
				horizontalAlign={Flyout.ALIGNMENTS.RIGHT}
				ref={this.attachOptionsFlyoutRef}
				autoDismissOnAction
			>
				<CourseMenu
					course={course}
					onBeforeDrop={this.onBeforeDrop}
					onAfterDrop={this.onAfterDrop}
					registered
				/>
			</Flyout.Triggered>
		);
	}

	onBeforeDrop = event => {
		// show spinner while drop request is in flight
		this.setState({ loading: true });
		return this.props.onBeforeDrop?.(event);
	};

	onAfterDrop = event => {
		// hide spinner when drop request completes
		this.setState({ loading: false });
		return this.props.onAfterDrop?.(event);
	};

	viewDetails = e => {
		e.stopPropagation();
		e.preventDefault();

		this.setState({ showDetails: true });
	};

	render() {
		const { course, ...otherProps } = this.props;
		const { showDetails, loading } = this.state;
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
				{loading && (
					<Loading.Overlay loading={true} label={null} large />
				)}
			</Link>
		);
	}
}

Registry.register(
	'application/vnd.nextthought.courseware.courseinstanceenrollment'
)(EnrollmentCard);
