import './CourseSettingsMenu.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import DropCourseButton from '../../enrollment/DropCourseButton';

const t = scoped('course.components.card.parts.CourseSettingsMenu', {
	edit: 'Edit Course Information',
	export: 'Export',
	delete: 'Delete Course',
	registered: 'You\'re Registered'
});

export default class CourseMenu extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		doEdit: PropTypes.func,
		doExport: PropTypes.func,
		doDelete: PropTypes.func,
		doRequestSupport: PropTypes.func,
		registered: PropTypes.bool,
		admin: PropTypes.bool
	}

	renderRegisteredIcon () {
		if(this.props.registered) {
			return (<div className="registered-icon"/>);
		}
	}

	renderOptionsHeader () {
		const { course, registered } = this.props;

		return (
			<div className="header">
				{this.renderRegisteredIcon()}
				<div className="header-info">
					<div className="course-name">{course.title}</div>
					<div className="course-status">{registered ? t('registered') : ''}</div>
				</div>
			</div>
		);
	}

	renderEdit () {
		const { doEdit } = this.props;

		if(doEdit) {
			return (<div onClick={doEdit} className="option">{t('edit')}</div>);
		}
	}

	renderExport () {
		const { doExport } = this.props;

		if(doExport) {
			return (<div onClick={doExport} className="option">{t('export')}</div>);
		}
	}



	renderDelete () {
		const { doDelete } = this.props;

		if(doDelete) {
			return (<div onClick={doDelete} className="option delete-course"><i className="icon-delete"/><span className="label">{t('delete')}</span></div>);
		}
	}

	launchSupportRequest (e) {
		e.stopPropagation();
		e.preventDefault();

		global.location.href = 'mailto:support@nextthought.com?subject=Support%20Request';
	}

	renderSupportLink () {
		const { doRequestSupport } = this.props;

		if(doRequestSupport) {
			return (<div onClick={doRequestSupport} className="option">Contact Support</div>);
		}
	}

	render () {
		const { course, admin } = this.props;

		return (
			<div className="course-settings-menu-flyout">
				{this.renderOptionsHeader()}
				{this.renderEdit()}
				{this.renderExport()}
				{this.renderSupportLink()}
				{this.renderDelete()}
				{!admin &&
					<DropCourseButton course={course} />
				}
			</div>
		);
	}
}
