import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import { getService } from '@nti/web-client';
import { Prompt, Flyout, Presentation } from '@nti/web-commons';
import cx from 'classnames';

import CourseMenu from './CourseMenu';


const t = scoped('course.components.listing.CourseCard', {
	confirmDelete: 'Do you want to delete this course?'
});

export default class CourseCard extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		onClick: PropTypes.func,
		onEdit: PropTypes.func,
		onModification: PropTypes.func,
		isAdministrative: PropTypes.bool,
		onToggle: PropTypes.func,
		selected: PropTypes.bool
	}

	attachOptionsFlyoutRef = x => this.optionsFlyout = x

	deleteCourse = (e) => {
		const { course, onModification } = this.props;

		e.stopPropagation();
		e.preventDefault();

		Prompt.areYouSure(t('confirmDelete')).then(() => {
			this.setState( { loading: true }, () => {
				getService().then((service) => {
					return service.getObject(course.CourseNTIID).then((courseInstance) => {
						return courseInstance.delete();
					});
				}).then(() => {
					onModification && onModification();
				}).catch(() => {
					// timeout here because there is a 500 ms delay on the areYouSure dialog being dismissed
					// so if the deletion fails too fast, we risk automatically dismissing this alert dialog
					// when the areYouSure dialog is dismissed
					setTimeout(() => {
						Prompt.alert('You don\'t have permission to delete this course');
					}, 505);
				});
			});
		});
	};

	doEdit = () => {
		const { onEdit, course } = this.props;

		onEdit && onEdit(course);
	}

	doExport = () => {
		const { course } = this.props;

		if(course.hasLink('Export')) {
			this.optionsFlyout && this.optionsFlyout.dismiss();

			window.location.href = course.getLink('Export');
		}
	}

	renderDelete () {
		const { course } = this.props;

		if(!course.hasLink('delete') || !this.props.isAdministrative) {
			return null;
		}

		return (<div className="course-delete" onClick={this.deleteCourse}><i className="icon-trash"/></div>);
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
		return (
			<div className="course-controls">
				{this.renderPreview()}
				{this.renderBadge()}
				{this.renderDefaultOptions()}
			</div>
		);
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

	renderDefaultOptions () {
		if(this.props.isAdministrative) {
			return null;
		}

		return this.renderOptions();
	}

	renderAdminOptions () {
		if(!this.props.isAdministrative) {
			return null;
		}

		return (<div className="admin-controls">{this.renderOptions()}</div>);
	}

	renderOptions () {
		return (
			<Flyout.Triggered
				className="admin-course-options"
				trigger={this.renderOptionsButton()}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				sizing={Flyout.SIZES.MATCH_SIDE}
				ref={this.attachOptionsFlyoutRef}
				arrow
			>
				<CourseMenu course={this.props.course} doEdit={this.doEdit} doExport={this.doExport} doDelete={this.deleteCourse}/>
			</Flyout.Triggered>
		);
	}

	onCourseClick = () => {
		const { course, onClick } = this.props;

		onClick && onClick(course);
	}

	onCheckClick = (e) => {
		e.stopPropagation();
		e.preventDefault();

		const { course, selected, onToggle } = this.props;

		onToggle && onToggle(course, !selected);
	}

	renderCheckbox () {
		const {selected} = this.props;
		const clsName = cx('toggler', {selected});

		return (
			<div className="toggler-container" onClick={this.onCheckClick}>
				<div className={clsName}/>
			</div>
		);
	}

	render () {
		const { course } = this.props;

		return (
			<div className="course-item" onClick={this.onCourseClick}>
				<div className="cover">
					<Presentation.AssetBackground className="course-image" contentPackage={course} type="landing"/>
				</div>
				{this.renderControls()}
				<div className="course-meta">
					<div className="course-id">{course.ProviderUniqueID}</div>
					<div className="course-title">{course.title}</div>
					{this.renderInstructors()}
				</div>
				{this.renderAdminOptions()}
				{this.renderCheckbox()}
			</div>
		);
	}
}
