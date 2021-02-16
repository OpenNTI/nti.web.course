import React from 'react';
import PropTypes from 'prop-types';
import { getService } from '@nti/web-client';
import { Loading, Prompt } from '@nti/web-commons';

import * as Editor from '../editor';

import CourseCard from './CourseCard';

export default class CourseListing extends React.Component {
	static propTypes = {
		onCourseClick: PropTypes.func,
		isAdministrative: PropTypes.bool,
	};

	constructor(props) {
		super(props);

		this.state = { selectedItems: [], loading: false, courses: [] };
	}

	componentDidMount() {
		this.loadAllCourses();
	}

	loadAllCourses = async () => {
		if (this.state.loading) {
			return;
		}

		this.setState({ loading: true });

		const service = await getService();

		const collection = service.getCollection('AllCourses', 'Courses');

		if (collection) {
			const { Items } = await service.get(collection.href);
			const courses = await service.getObject(Items);

			this.setState({ loading: false, courses });
		}
	};

	renderLoading() {
		return this.state.loading ? <Loading.Mask /> : null;
	}

	showEditor = course => {
		Editor.editCourse(course);
	};

	isSelected(course) {
		const id = course && course.NTIID;

		const { selectedItems } = this.state;

		return selectedItems.some(x => x.NTIID === id);
	}

	onToggle = (course, value) => {
		let { selectedItems } = this.state;

		if (value) {
			if (!this.isSelected(course)) {
				selectedItems.push(course);
			}
		} else {
			if (this.isSelected(course)) {
				selectedItems = selectedItems.filter(
					x => x.NTIID !== course.NTIID
				);
			}
		}

		this.setState({ selectedItems });
	};

	renderCourse(course, index) {
		const { onCourseClick } = this.props;

		return (
			<div key={index}>
				<CourseCard
					course={course}
					onClick={onCourseClick ? onCourseClick : this.showEditor}
					onEdit={this.showEditor}
					onModification={this.loadAllCourses}
					isAdministrative={this.props.isAdministrative}
					onToggle={this.onToggle}
					selected={this.isSelected(course)}
				/>
			</div>
		);
	}

	onDelete = () => {
		Prompt.areYouSure('').then(() => {
			this.deleteAllSelected();
		});
	};

	async deleteAllSelected() {
		const { selectedItems } = this.state;

		const service = await getService();

		const courses = await Promise.all(
			selectedItems.map(x => service.getObject(x.CourseNTIID))
		);

		await Promise.all(courses.map(x => x.delete()));

		alert('Deleted ' + courses.length + ' courses');
	}

	renderToolbar() {
		if (this.state.loading) {
			return null;
		}

		return (
			<div className="course-list-toolbar">
				<div className="delete-button" onClick={this.onDelete}>
					Delete
				</div>
			</div>
		);
	}

	renderCourses() {
		if (this.state.loading) {
			return null;
		}

		return (
			<div className="course-item-list">
				{this.state.courses.map((course, index) =>
					this.renderCourse(course, index)
				)}
			</div>
		);
	}

	render() {
		return (
			<div className="course-listing">
				{this.renderLoading()}
				{this.renderToolbar()}
				{this.renderCourses()}
			</div>
		);
	}
}
