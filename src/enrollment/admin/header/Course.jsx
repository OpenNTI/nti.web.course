import React from 'react';
import PropTypes from 'prop-types';
import {Presentation} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

const t = scoped('course.enrollment.admin.header.Course', {
	notSelected: 'Select a Course...'
});

export default class CourseEnrollmentAdminHeaderCourseItem extends React.Component {
	static propTypes = {
		course: PropTypes.object
	}


	render () {
		const {course} = this.props;

		return (
			<div className="course-enrollment-admin-header-course-item">
				{course && this.renderCourse(course)}
				{!course && this.renderEmpty()}
			</div>
		);
	}


	renderEmpty () {
		return (
			<div className="empty">
				{t('notSelected')}
			</div>
		);
	}

	renderCourse (course) {
		return (
			<div className="course">
				<Presentation.Asset contentPackage={course} propName="src" type="landing">
					<img className="icon" />
				</Presentation.Asset>
				<div className="meta">
					<span className="provider-id">{course.ProviderUniqueID}</span>
					<span className="title">{course.title}</span>
				</div>
			</div>
		);
	}
}
