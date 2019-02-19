import React from 'react';
import PropTypes from 'prop-types';
import {getService} from '@nti/web-client';
import {Presentation} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

const t = scoped('course.enrollment.admin.header.Course', {
	notSelected: 'Select a Course...'
});

export default class CourseEnrollmentAdminHeaderCourseItem extends React.Component {
	static propTypes = {
		course: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		locked: PropTypes.bool,
		onSelected: PropTypes.func
	}

	state = {}

	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (prevProps) {
		const {course} = this.props;
		const {course: prevCourse} = prevProps;

		if (course !== prevCourse) {
			this.setupFor(this.props);
		}
	}


	async setupFor (props) {
		const {course} = props;

		if (course && typeof course !== 'string') {
			this.setState({course});
			return;
		}

		try {
			const service = await getService();
			const resolved = await service.getObject(course);

			this.setState({
				course: resolved
			});
		} catch (e) {
			this.setState({
				course: null
			});
		}
	}


	onClear = () => {
		const {onSelected} = this.props;

		if (onSelected) {
			onSelected(null);
		}
	}


	render () {
		const {course} = this.state;

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
		const {locked} = this.props;

		return (
			<div className="course">
				<Presentation.Asset contentPackage={course} propName="src" type="landing">
					<img className="icon" />
				</Presentation.Asset>
				<div className="meta">
					<span className="provider-id">{course.ProviderUniqueID}</span>
					<span className="title">{course.title}</span>
				</div>
				{!locked && (
					<div className="clear" onClick={this.onClear}>
						<i className="icon-bold-x" />
					</div>
				)}
			</div>
		);
	}
}
