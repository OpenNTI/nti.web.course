import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { LinkTo } from '@nti/web-routing';
import { getService } from '@nti/web-client';
import { DateTime, Prompt, Flyout, Layouts } from '@nti/web-commons';

import { getSemesterBadge } from '../../utils/Semester';
import ArchivedIcon from '../parts/ArchivedIcon';
import Card from '../parts/Card';
import Badge from '../parts/Badge';
import Settings from '../parts/SettingsIcon';
import CourseMenu from '../../SettingsMenu';

import Registry from './Registry';

const { Responsive } = Layouts;

const t = scoped('course.card.type.administering', {
	starting: 'draft',
	confirmDelete: 'Do you want to delete this course?',
});

const Link = styled(LinkTo.Object)`
	position: relative;
	display: block;
`;

export default class Administrative extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		onEdit: PropTypes.func,
		onModification: PropTypes.func,
		onDelete: PropTypes.func,
		onClick: PropTypes.func,
	};

	static contextTypes = {
		router: PropTypes.object,
	};

	attachOptionsFlyoutRef = x => (this.optionsFlyout = x);

	deleteCourse = e => {
		const { course, onModification, onDelete } = this.props;

		e.preventDefault();

		Prompt.areYouSure(t('confirmDelete')).then(() => {
			this.setState({ loading: true }, () => {
				getService()
					.then(service => {
						return service
							.getObject(course.CatalogEntry.CourseNTIID)
							.then(courseInstance => {
								return courseInstance.delete();
							});
					})
					.then(() => {
						onModification && onModification();
						onDelete?.(course);
					})
					.catch(err => {
						console.error(err); //eslint-disable-line
						// timeout here because there is a 500 ms delay on the areYouSure dialog being dismissed
						// so if the deletion fails too fast, we risk automatically dismissing this alert dialog
						// when the areYouSure dialog is dismissed
						setTimeout(() => {
							Prompt.alert(
								"You don't have permission to delete this course"
							);
						}, 505);
					});
			});
		});
	};

	doEdit = e => {
		const { onEdit, course } = this.props;

		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		if (onEdit) {
			onEdit(course);
		} else if (this.context.router) {
			this.context.router.routeTo.object(course, 'edit');
		}
	};

	doExport = e => {
		e.stopPropagation();
		e.preventDefault();

		const { course } = this.props;

		if (course.CatalogEntry.hasLink('Export')) {
			this.optionsFlyout && this.optionsFlyout.dismiss();

			global.location.href = course.CatalogEntry.getLink('Export');
		}
	};

	renderOptions() {
		const { course } = this.props;
		const canExport =
			course &&
			course.CatalogEntry &&
			course.CatalogEntry.hasLink('Export');

		return (
			<Flyout.Triggered
				className="admin-course-options"
				trigger={<Settings />}
				horizontalAlign={Flyout.ALIGNMENTS.RIGHT}
				ref={this.attachOptionsFlyoutRef}
				autoDismissOnAction
			>
				<CourseMenu
					registered
					admin
					course={course}
					onEdit={this.doEdit}
					onExport={canExport ? this.doExport : null}
					onDelete={this.deleteCourse}
				/>
			</Flyout.Triggered>
		);
	}

	render() {
		const { course, onClick, ...otherProps } = this.props;
		const startDate = course.CatalogEntry.getStartDate();
		const endDate = course.CatalogEntry.getEndDate();
		const preview = course.CatalogEntry.Preview;
		const now = new Date();
		const badges = [];

		const starting = startDate && startDate > now;
		const finished = endDate && endDate < now;

		if (preview) {
			badges.push(<Badge orange>{t('starting')}</Badge>);
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
			<Link object={course} onClick={onClick}>
				<Card
					{...otherProps}
					course={course.CatalogEntry}
					badges={badges}
					className="no-padding"
				/>
				{Responsive.isWebappContext() && this.renderOptions()}
			</Link>
		);
	}
}

Registry.register(
	'application/vnd.nextthought.courseware.courseinstanceadministrativerole'
)(Administrative);
