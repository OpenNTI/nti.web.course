import React from 'react';
import PropTypes from 'prop-types';

import User from './User';
import Course from './Course';

export default class CourseEnrollmentAdminHeader extends React.Component {
	static propTypes = {
		stages: PropTypes.array,
		course: PropTypes.object,
		user: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
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
		const {user} = this.props;

		return (
			<User user={user} />
		);
	}


	renderCourse () {
		const {course} = this.props;

		return (
			<Course course={course} />
		);
	}
}
