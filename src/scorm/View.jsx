
import React, { Component } from 'react';
import { Button, Layouts } from 'nti-web-commons';
import PropTypes from 'prop-types';
import { scoped } from 'nti-lib-locale';

import Editor from './Editor';
import Progress from './Progress';

const IMPORT_SCORM = 'ImportScorm';
const { Responsive } = Layouts;

const t = scoped('scorm.view', {
	launch: 'Open',
	packageChange: 'Change Content Package',
	packageUpload: 'Add Content Package',
	packageExport: 'Export Content Package',
	scormDescription: 'This course uses an external website for displaying content. \n Follow the link below to access your course content.'
});

class Scorm extends Component {
	static propTypes = {
		bundle: PropTypes.shape({
			getScormCourse: PropTypes.func.isRequired,
			getID: PropTypes.func.isRequired,
			getLink: PropTypes.func.isRequired,
			fetchLink: PropTypes.func.isRequired
		}),
		error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		onBundleUpdate: PropTypes.func.isRequired
	}

	state = {
		scormLink: '',
		showEditor: false,
	}

	getLaunchLink = () => {
		return this.props.bundle.getScormCourse() + '?redirecturl=' + encodeURIComponent(global.location.href);
	}

	editScorm = () => {
		this.setState({ showEditor: true });
	}

	onDismiss = () => {
		this.setState({ showEditor: false });
	}

	onFinish = (newBundle) => {
		this.setState({ showEditor: false }, () => {
			this.props.onBundleUpdate(newBundle);
		});
	}

	exportScorm = () => {
		return this.props.bundle.getLink('SCORMArchive');
	}

	isCompletableCourse () {
		// drive this by CompletionPolicy or CourseProgress
		return Object.keys(this.props.bundle).includes('CompletionPolicy');
	}

	renderInstructor = () => {
		const { showEditor } = this.state;
		const { bundle, error } = this.props;
		const canLaunchCourse = bundle.Metadata.hasLink('LaunchSCORM');
		return (
			<div className="scorm-card scorm-instructor-card">
				<div className="course-info">
					<div className="scorm-title">{bundle.title}</div>
					{!Responsive.isMobile() && <a className="scorm-edit-link" onClick={this.editScorm}>{canLaunchCourse ? t('packageChange') : t('packageUpload')}</a>}
					{canLaunchCourse &&  <a className="scorm-export-link" href={this.exportScorm()} download>{t('packageExport')}</a>}
					<div className="scorm-desc">{t('scormDescription')}</div>
					{error && <div className="scorm-error">{error}</div>}
					{canLaunchCourse && <Button className="scorm-launch-button" href={this.getLaunchLink()} rel="external">{t('launch')}</Button>}
					{showEditor && !Responsive.isMobile() && <Editor onDismiss={this.onDismiss} onFinish={this.onFinish} bundle={bundle} />}
				</div>
				{this.isCompletableCourse() && <Progress bundle={bundle} isAdmin/>}
			</div>
		);
	}

	renderStudent = () => {
		const { bundle, error } = this.props;

		return (
			<div className="scorm-card scorm-student-card">
				<div className="scorm-student-progress">
					<div className="course-info">
						<div className="scorm-title">{ bundle.title }</div>
						<div className="scorm-desc">{t('scormDescription')}</div>
						{error && <div className="scorm-error">{error}</div>}
						{bundle.Metadata.hasLink('LaunchSCORM') && <Button className="scorm-launch-button" href={this.getLaunchLink()} rel="external">{t('launch')}</Button>}
					</div>
					{this.isCompletableCourse() && <Progress bundle={bundle}/>}
				</div>
			</div>
		);
	}

	render () {
		const { bundle } = this.props;
		const isInstructor = bundle.hasLink(IMPORT_SCORM);

		return (
			<div className="scorm-overview-body">
				<div className="scorm-content">
					{!isInstructor && this.renderStudent()}
					{isInstructor && this.renderInstructor()}
				</div>
			</div>
		);
	}
}

export default Scorm;
