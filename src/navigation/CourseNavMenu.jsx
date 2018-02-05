import React from 'react';
import PropTypes from 'prop-types';
import {Flyout, Prompt} from 'nti-web-commons';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';
import {getService} from 'nti-web-client';

import {PublishCourse} from '../components';

const LABELS = {
	courses: 'Courses',
	sections: 'Sections',
	edit: 'Edit Course Information',
	publish: 'Course Visibility'
};

const t = scoped('nti-web-course.navigation.CourseNavMenu', LABELS);

class SectionItem extends React.Component {
	static propTypes = {
		section: PropTypes.object.isRequired,
		onClick: PropTypes.func
	}

	onClick = () => {
		const { section, onClick } = this.props;

		onClick && onClick(section);
	}

	render () {
		const { section } = this.props;

		const className = cx('section', section.cls);

		return (
			<div className={className}>
				<div className="section-title" onClick={this.onClick}>{section.title}</div>
			</div>
		);
	}
}

class RecentCourseItem extends React.Component {
	static propTypes = {
		recentCourse: PropTypes.object.isRequired,
		onClick: PropTypes.func
	}

	attachFlyoutRef = x => this.flyout = x

	onClick = () => {
		const { recentCourse, onClick } = this.props;

		onClick && onClick(recentCourse);
	}

	renderCourse () {
		const { recentCourse } = this.props;

		return (
			<div className="recent-course" onClick={this.onClick}>
				<img className="course-icon" src={recentCourse.thumb}/>
			</div>
		);
	}

	render () {
		const { recentCourse } = this.props;

		return (<Flyout.Triggered
			className="recent-course-trigger"
			trigger={this.renderCourse()}
			verticalAlign={Flyout.ALIGNMENTS.TOP}
			ref={this.attachFlyoutRef}
			hover
			arrow
		>
			<div>
				<div className="recent-course-info">{recentCourse.title}</div>
			</div>
		</Flyout.Triggered>);
	}
}

export default class CourseNavMenu extends React.Component {
	static propTypes = {
		activeCourse: PropTypes.object,
		recentCourses: PropTypes.arrayOf(PropTypes.object),
		onItemClick: PropTypes.func,
		goToEditor: PropTypes.func,
		onDelete: PropTypes.func,
		onVisibilityChanged: PropTypes.func,
		isAdministrator: PropTypes.bool
	}

	constructor (props) {
		super(props);
		this.state = {};
	}

	onEditClick = () => {
		const { goToEditor, activeCourse } = this.props;

		goToEditor && goToEditor(activeCourse);
	}

	launchPublishDialog = () => {
		const { activeCourse, onItemClick } = this.props;

		onItemClick && onItemClick();

		const { subItems } = activeCourse;

		let courseId = activeCourse.id;

		if(subItems) {
			const filteredToSelected = subItems.filter(x => x.cls === 'current')[0];

			if(filteredToSelected) {
				courseId = filteredToSelected.id;
			}
		}

		PublishCourse.show(courseId)
			.then(savedEntry => {
				const { onVisibilityChanged } = this.props;

				onVisibilityChanged && onVisibilityChanged(savedEntry);
			}).catch(e => {
				// cancelled dialog
			});
	}

	renderActiveCourse () {
		const { activeCourse, isAdministrator } = this.props;

		if(!activeCourse) {
			return null;
		}

		return (
			<div className="active-course">
				<img className="course-icon" src={activeCourse.thumb}/>
				<div className="course-info">
					<div className="course-header">
						<div className="title">{activeCourse.title}</div>
						{isAdministrator ?
							(
								<div className="delete-course" onClick={this.delete}>
									<i className="icon-delete"/>
								</div>
							)
							: null}
					</div>
					{isAdministrator ? (<div className="edit" onClick={this.onEditClick}>{t('edit')}</div>) : null}
					{isAdministrator ? (<div className="publish" onClick={this.launchPublishDialog}>{t('publish')}</div>) : null}
				</div>
			</div>
		);
	}

	renderSection = (section) => {
		return <SectionItem key={section.id} section={section} onClick={this.props.onItemClick}/>;
	}

	renderSections () {
		const { subItems } = this.props.activeCourse || {};

		if(!subItems || subItems.length === 0) {
			return null;
		}

		return (
			<div className="sections">
				<div className="section-label">{t('sections')}</div>
				<div className="sections-list">
					{subItems.map(this.renderSection)}
				</div>
			</div>
		);
	}

	delete = () => {
		Prompt.areYouSure('Do you want to delete this course?').then(() => {
			return getService();
		}).then((service) => {
			return service.getObject(this.props.activeCourse.id);
		}).then((courseInstance) => {
			return courseInstance.delete('delete').then(() => {
				return true;
			}).catch((resp) => {
				if(resp && resp.message) {
					alert(resp.message);
				}
				else {
					alert('You don\'t have permission to delete this course');
				}
				return false;
			});
		}).then((success) => {
			const { onDelete } = this.props;

			onDelete && onDelete();
		});
	}

	renderRecentCourse = (course) => {
		return <RecentCourseItem key={course.id} recentCourse={course} onClick={this.props.onItemClick}/>;
	}

	renderRecentCourses () {
		const { recentCourses } = this.props;

		if(!recentCourses || recentCourses.length === 0) {
			return null;
		}

		return (
			<div className="recent-courses">
				<div className="section-label">{t('courses')}</div>
				<div className="recent-courses-list">
					{recentCourses.map(this.renderRecentCourse)}
				</div>
			</div>
		);
	}

	render () {
		return (
			<div className="course-nav-menu">
				{this.renderActiveCourse()}
				{this.renderSections()}
				{this.renderRecentCourses()}
			</div>
		);
	}
}
