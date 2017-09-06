import React from 'react';
import PropTypes from 'prop-types';
import { getService } from 'nti-web-client';
import { Prompt, Loading } from 'nti-web-commons';

import CourseEditor from '../editor/CourseEditor';

import CourseCard from './CourseCard';

export default class CourseListing extends React.Component {
	static propTypes = {
		courses: PropTypes.arrayOf(PropTypes.object),
		isAdministrative: PropTypes.bool
	}

	constructor (props) {
		super(props);

		this.state = { loading: true, courses: [] };

		this.loadAllCourses();
	}

	loadAllCourses () {
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

	onCancel = () => {
		this.modalDialog && this.modalDialog.dismiss && this.modalDialog.dismiss();

		delete this.modalDialog;
	}

	onFinish = () => {
		this.setState({active:false});

		this.modalDialog && this.modalDialog.dismiss && this.modalDialog.dismiss();

		delete this.modalDialog;
	}

	renderLoading () {
		return this.state.loading ? (<Loading.Mask/>) : null;
	}

	renderCourse (course, index) {
		const showEditor = () => {
			this.modalDialog = Prompt.modal(<CourseEditor catalogEntry={course}  onCancel={this.onCancel} onFinish={this.onFinish}/>,
				'course-panel-wizard');
		};

		return (<div key={index}><CourseCard course={course} onClick={showEditor} onEdit={showEditor} isAdministrative={this.props.isAdministrative}/></div>);
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
