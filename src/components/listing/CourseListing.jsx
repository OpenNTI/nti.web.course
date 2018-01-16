import React from 'react';
import PropTypes from 'prop-types';
import { getService } from 'nti-web-client';
import { Loading } from 'nti-web-commons';

import { Editor } from '../../';

import CourseCard from './CourseCard';

export default class CourseListing extends React.Component {
	static propTypes = {
		onCourseClick: PropTypes.func,
		isAdministrative: PropTypes.bool
	}

	constructor (props) {
		super(props);

		this.state = { loading: true, courses: [] };

		this.loadAllCourses();
	}

	loadAllCourses = () => {
		this.setState({loading: true});

		getService().then((service) => {
			const collection = service.getCollection('AllCourses', 'Courses');

			if(collection) {
				service.get(collection.href).then((results) => {
					return service.getObject(results.Items);
				}).then((parsed) => {
					this.setState({loading: false, courses: parsed});
				});
			}
		});
	}

	renderLoading () {
		return this.state.loading ? (<Loading.Mask/>) : null;
	}

	showEditor = (course) => {
		Editor.editCourse(course);
	}

	renderCourse (course, index) {
		const { onCourseClick } = this.props;

		return (
			<div key={index}>
				<CourseCard
					course={course}
					onClick={onCourseClick ? onCourseClick : this.showEditor}
					onEdit={this.showEditor}
					onModification={this.loadAllCourses}
					isAdministrative={this.props.isAdministrative}/>
			</div>
		);
	}

	renderCourses () {
		if(this.state.loading) {
			return null;
		}

		return (<div className="course-item-list">
			{this.state.courses.map((course, index) => this.renderCourse(course, index))}
		</div>);
	}

	render () {
		return (<div className="course-listing">
			{this.renderLoading()}
			{this.renderCourses()}
		</div>
		);
	}
}
