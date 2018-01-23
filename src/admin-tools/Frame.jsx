import React from 'react';
import PropTypes from 'prop-types';
import {Loading} from 'nti-web-commons';
import {decodeFromURI} from 'nti-lib-ntiids';

import Store from './Store';

@Store.connect({course: 'course', loading: 'loading'})
export default class CourseAdminView extends React.Component {
	static propTypes = {
		courseID: PropTypes.string.isRequired,

		course: PropTypes.object,
		loading: PropTypes.bool,
		store: PropTypes.object,

		children: PropTypes.element
	}

	get store () {
		return this.props.store;
	}


	getCourseID (props = this.props) {
		const {courseID} = props;

		return decodeFromURI(courseID);
	}


	componentWillReceiveProps (nextProps) {
		const newID = this.getCourseID(nextProps);
		const oldID = this.getCourseID(this.props);

		if (newID !== oldID) {
			this.store.loadUser(newID);
		}
	}


	componentDidMount () {
		this.store.loadCourse(this.getCourseID());
	}


	render () {
		const {loading} = this.props;

		return (
			<div className="site-admin-course-view">
				{loading && (<Loading.Mask />)}
				{!loading && this.renderCourse()}
			</div>
		);
	}


	renderCourse () {
		const {course, children} = this.props;

		if (!course) {
			return null;
		}

		return (
			<div>
				{React.Children.map(children, (item) => {
					return React.cloneElement(item, {course});
				})}
			</div>
		);
	}
}
