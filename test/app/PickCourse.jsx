import React from 'react';
import PropTypes from 'prop-types';
import {getService} from '@nti/web-client';
import {Library} from '@nti/lib-interfaces';

const stop = e => (e.stopPropagation(), e.preventDefault());

export default class PickCourse extends React.Component {
	static propTypes = {
		children: PropTypes.any
	}

	state = {loading: true}

	async componentDidMount () {
		const {courseId} = localStorage;
		if (courseId) {
			this.setState({loading: false, courseId});
			return;
		}


		const service = await getService();
		this.library = Library.get(service, 'Main');
		this.library.addListener('change', this.handleLibraryUpdate);
		this.unsubscribe = () => this.library.removeListener('change', this.handleLibraryUpdate);
	}

	componentWillUnmount () {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}

	handleLibraryUpdate = () => {
		this.setState({loading: false});
	}

	select (record) {
		const courseId = record.getCourseID();
		localStorage.setItem('courseId', courseId);
		this.setState({courseId});
	}

	render () {
		const {state: {courseId, loading}, library, props: {children}} = this;
		const child = React.Children.only(children);

		const {administeredCourses = [], courses = []} = library || {};

		const all = [...courses, ...administeredCourses];

		return courseId
			? React.cloneElement(child, {courseId})
			: (
				<div>
					{loading ? 'Loading...' : (
						all.map(x => this.renderLink(x))
					)}
				</div>
			);
	}


	renderLink (record) {
		const select = (x) => (e) => (stop(e), this.select(x));

		return (
			<div key={record.getID() || record.getCourseId && record.getCourseId() || Math.random()}>
				<a onClick={select(record)} href="#">
					({record.ProviderUniqueID}) {record.title}{record.isAdministrative ? ' (Admin)' : ''}
				</a>
			</div>
		);
	}
}
