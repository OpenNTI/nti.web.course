
import React, { Component } from 'react';
import { Button, Layouts } from 'nti-web-commons';
import PropTypes from 'prop-types';

import Editor from './Editor';

const IMPORT_SCORM = 'ImportScorm';
const { Responsive } = Layouts;

class Scorm extends Component {
	static propTypes = {
		bundle: PropTypes.shape({
			getScormCourse: PropTypes.func.isRequired,
			getID: PropTypes.func.isRequired,
			getLink: PropTypes.func.isRequired
		})
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

	renderInstructor = () => {
		const { showEditor } = this.state;
		const { bundle } = this.props;

		return (
			<div className="scorm-card scorm-instructor-card">
				<div className="scorm-title">{bundle.title}</div>
				<a className="scorm-edit-link" onClick={this.editScorm}>Change Content Package</a>
				<div className="scorm-desc">
					This course uses an external website for displaying content.
					Follow the link below to access your course content.
				</div>
				{bundle.Metadata.hasLink('LaunchSCORM') && <Button className="scorm-launch-button" href={this.getLaunchLink()} rel="external">Open</Button>}
				{showEditor && !Responsive.isMobile() && <Editor onDismiss={this.onDismiss} bundle={this.props.bundle} />}
			</div>
		);
	}

	renderStudent = () => {
		const { bundle } = this.props;

		return (
			<div className="scorm-card scorm-student-card">
				<div className="scorm-student-progress">
					<div className="scorm-title">{ bundle.title }</div>
					<div className="scorm-desc">
						This course uses an external website for displaying content.
						Follow the link below to access your course content.
					</div>
					{bundle.Metadata.hasLink('LaunchSCORM') && <Button className="scorm-launch-button" href={this.getLaunchLink()} rel="external">Open</Button>}
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
