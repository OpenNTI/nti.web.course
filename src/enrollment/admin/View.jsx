import React from 'react';
import PropTypes from 'prop-types';

import Header from './header';
import PickUser from './pick-user';
import PickCourse from './pick-course';
import MangaeEnrollment from './manage-enrollment';

const getStages = () => ([
	{
		name: 'user',
		isDone: ({user}) => !!user
	},
	{
		name: 'course',
		isDone: ({course}) => !!course
	},
	{
		name: 'manage',
		isDone: () => false
	}
]);

export default class CourseEnrollmentAdmin extends React.Component {
	static propTypes = {
		course: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		enrollment: PropTypes.object,
		onChange: PropTypes.func
	}

	state = {}


	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (prevProps) {
		const {course, user} = this.props;
		const {course:oldCourse, user:oldUser} = prevProps;

		if (course !== oldCourse || user !== oldUser) {
			this.setupFor(this.props);
		}
	}


	setupFor (props = this.props) {
		const {course:courseProp, user:userProp, enrollment} = props;

		const course = enrollment ? enrollment.CatalogEntry : courseProp;
		const user = enrollment ? enrollment.Username : userProp;

		const state = {course, user};
		const stages = getStages();

		stages.sort((stageA, stageB) => {
			const aDone = stageA.isDone(state);
			const bDone = stageB.isDone(state);

			if (aDone && bDone) { return 0; }
			if (!aDone && bDone) { return 1; }
			if (aDone && !bDone) { return -1; }
		});

		this.setState({course, user, stages});
	}


	onCourseSelected = (course) => {
		this.setState({course});
	}


	onUserSelected = (user) => {
		this.setState({user});
	}


	render () {
		const {stages, user, course} = this.state;
		const active = (stages && stages.find(stage => !stage.isDone(this.state))) || {};

		return (
			<div className="course-enrollment-admin-view">
				<Header
					stages={stages}
					user={user}
					course={course}
					onCourseSelected={this.onCourseSelected}
					onUserSelected={this.onUserSelected}
				/>
				{active.name === 'user' && this.renderUser()}
				{active.name === 'course' && this.renderCourse()}
				{active.name === 'manage' && this.renderManageEnrollment(user, course)}
			</div>
		);
	}


	renderUser () {
		return (
			<PickUser onUserSelected={this.onUserSelected} />
		);
	}


	renderCourse () {
		return (
			<PickCourse onCourseSelected={this.onCourseSelected} />
		);
	}


	renderManageEnrollment (user, course) {
		const {enrollment, onChange} = this.props;

		return (
			<MangaeEnrollment user={user} course={course} enrollment={enrollment} onChange={onChange} />
		);
	}

}
