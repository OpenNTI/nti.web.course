import React from 'react';
import PropTypes from 'prop-types';

import User from './User';
import Course from './Course';

export default class CourseEnrollmentAdminHeader extends React.Component {
	static propTypes = {
		stages: PropTypes.array,
		course: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		courseLocked: PropTypes.bool,
		user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		userLocked: PropTypes.bool,
		onUserSelected: PropTypes.func,
		onCourseSelected: PropTypes.func
	}


	render () {
		const {stages} = this.props;

		if (!stages) { return null; }

		return (
			<div className="nti-course-enrollment-admin-header">
				<ul>
					{stages.map((stage, index) => {
						const cmp = this.renderStage(stage, stages[index - 1]);

						if (!cmp) { return null; }

						return (
							<li key={index}>
								{cmp}
							</li>
						);
					})}
				</ul>
			</div>
		);
	}


	renderStage (stage, prevStage) {
		if (prevStage && !prevStage.isDone(this.props)) { return null; }

		if (stage.name === 'user') { return this.renderUser(); }
		if (stage.name === 'course') { return this.renderCourse(); }
	}


	renderUser () {
		const {user, userLocked, onUserSelected} = this.props;

		return (
			<User user={user} locked={userLocked} onSelected={onUserSelected}/>
		);
	}


	renderCourse () {
		const {course, courseLocked, onCourseSelected} = this.props;

		return (
			<Course course={course} locked={courseLocked} onSelected={onCourseSelected} />
		);
	}
}
