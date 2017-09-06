import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import { getService } from 'nti-web-client';
import { Prompt, Loading } from 'nti-web-commons';

import CourseEditor from '../editor/CourseEditor';
import {getImageUrl} from '../utils';

const LABELS = {
	allCourses: 'All Courses',
	confirmDelete: 'Do you want to delete this course?'
};

const t = scoped('COURSE_LISTING', LABELS);

export default class CourseListing extends React.Component {
	static propTypes = {
		courses: PropTypes.arrayOf(PropTypes.object)
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
	};

	onFinish = () => {
		this.setState({active:false});

		this.modalDialog && this.modalDialog.dismiss && this.modalDialog.dismiss();

		delete this.modalDialog;
	};

	renderLoading () {
		return this.state.loading ? (<Loading.Mask/>) : null;
	}

	renderDelete (course) {
		if(!course.hasLink('delete')) {
			return null;
		}

		const deleteCourse = (e) => {
			e.stopPropagation();
			e.preventDefault();

			Prompt.areYouSure(t('confirmDelete')).then(() => {
				this.setState( { loading: true }, () => {
					getService().then((service) => {
						return service.getObject(course.CourseNTIID).then((courseInstance) => {
							return courseInstance.delete();
						});
					}).then(() => {
						this.loadAllCourses();
					});
				});
			});
		};

		return (<div className="course-delete" onClick={deleteCourse}><i className="icon-trash"/></div>);
	}

	renderCourse (course, index) {
		const showEditor = () => {
			this.modalDialog = Prompt.modal(<CourseEditor catalogEntry={course}  onCancel={this.onCancel} onFinish={this.onFinish}/>,
				'course-panel-wizard');
		};

		return (<div className="course-item" key={index} onClick={showEditor}>
			<div className="cover">
				<div className="course-image" style={{
					backgroundImage: 'url(' + getImageUrl(course) + ')'
				}}/>
			</div>
			<div className="course-meta">
				{this.renderDelete(course)}
				<div className="course-id">{course.ProviderUniqueID}</div>
				<div className="course-title">{course.title}</div>
			</div>
		</div>);
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
