import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import { getService } from 'nti-web-client';
import { Prompt, Flyout } from 'nti-web-commons';

import {getImageUrl} from '../../utils';

import CourseMenu from './CourseMenu';

const LABELS = {
	confirmDelete: 'Do you want to delete this course?'
};

const t = scoped('COURSE_LISTING', LABELS);

export default class CourseCard extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		onClick: PropTypes.func,
		onEdit: PropTypes.func,
		isAdministrative: PropTypes.bool
	}

	attachOptionsFlyoutRef = x => this.optionsFlyout = x

	deleteCourse = (e) => {
		const { course } = this.props;

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

	doEdit = () => {
		const { onEdit } = this.props;

		onEdit && onEdit();
	}

	doExport = () => {
		// TODO: Add server hook to export course data
	}

	renderDelete () {
		const { course } = this.props;

		if(!course.hasLink('delete') || !this.props.isAdministrative) {
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

	renderInstructors () {
		const { course } = this.props;

		if(course.Instructors && course.Instructors.length > 0) {
			const instructorStr = course.Instructors.map(x => x.Name).reduce((acc, val) => { return acc + ', ' + val; });

			return (<div className="course-instructors">{instructorStr}</div>);
		}

		return null;
	}

	renderControls () {
		return (<div className="course-controls">
			{this.renderPreview()}
			{this.renderBadge()}
			{this.renderOptions()}
		</div>);
	}

	renderPreview () {
		const { course } = this.props;

		if(course.Preview) {
			return (<div className="preview">Preview</div>);
		}

		return null;
	}

	renderBadge () {
		return null;
	}

	renderOptionsButton () {
		return (<div className="options"><i className="icon-settings"/></div>);
	}

	renderOptionsHeader () {
		const { course } = this.props;

		return (
			<div>
				<div className="course-name">{course.title}</div>
				<div className="course-status">{this.props.isAdministrative ? 'Administering' : ''}</div>
			</div>
		);
	}

	renderOptions () {
		return (<Flyout.Triggered
			className="admin-course-options"
			trigger={this.renderOptionsButton()}
			horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			sizing={Flyout.SIZES.MATCH_SIDE}
			ref={this.attachOptionsFlyoutRef}
			arrow
		>
			<CourseMenu course={this.props.course} doEdit={this.doEdit} doExport={this.doExport} doDelete={this.deleteCourse}/>
		</Flyout.Triggered>);
	}

	render () {
		const { course, onClick } = this.props;

		return (<div className="course-item" onClick={onClick}>
			<div className="cover">
				<div className="course-image" style={{
					backgroundImage: 'url(' + getImageUrl(course) + ')'
				}}/>
			</div>
			{this.renderControls()}
			<div className="course-meta">
				<div className="course-id">{course.ProviderUniqueID}</div>
				<div className="course-title">{course.title}</div>
				{this.renderInstructors()}
			</div>
		</div>);
	}
}
