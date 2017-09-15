import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

const LABELS = {
	edit: 'Edit Course Information',
	export: 'Export',
	delete: 'Delete Course',
	drop: 'Drop Course',
	registered: 'You\'re Registered'
};

const t = scoped('COURSE_MENU', LABELS);

export default class CourseMenu extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		doEdit: PropTypes.func,
		doExport: PropTypes.func,
		doDelete: PropTypes.func,
		doDrop: PropTypes.func,
		doRequestSupport: PropTypes.func,
		registered: PropTypes.string
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

	renderDrop () {
		const { doDrop } = this.props;

		if(doDrop) {
			return (<div onClick={doDrop} className="option delete-course"><span className="label">{t('drop')}</span></div>);
		}
	}

	renderDelete () {
		const { doDelete } = this.props;

		if(doDelete) {
			return (<div onClick={doDelete} className="option delete-course"><i className="icon-delete"/><span className="label">{t('delete')}</span></div>);
		}
	}

	launchSupportRequest () {
		window.location.href = 'mailto:support@nextthought.com?subject=Support%20Request';
	}

	renderSupportLink () {
		const { doRequestSupport } = this.props;

		if(doRequestSupport) {
			return (<div onClick={doRequestSupport} className="option">Contact Support</div>);
		}
	}

	render () {
		return (
			<div className="course-settings-menu">
				{this.renderOptionsHeader()}
				{this.renderEdit()}
				{this.renderExport()}
				{this.renderSupportLink()}
				{this.renderDelete()}
				{this.renderDrop()}
			</div>
		);
	}
}
