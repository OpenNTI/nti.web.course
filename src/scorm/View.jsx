import React, { Component } from 'react';
import { Button } from 'nti-web-commons';
import PropTypes from 'prop-types';

import Editor from './Editor';

const IMPORT_SCORM = 'ImportScorm';

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
		courseLaunched: false
	}

	componentDidUpdate (prevProps) {
		if (prevProps.bundle.getID() !== this.props.bundle.getID()) {
			this.setState({ scormLink: '', showEditor: false });
		}
	}

	launchCourse = async (e) => {
		e.preventDefault();

		const { bundle } = this.props;
		const scormLink = await bundle.getScormCourse();

		this.setState({ scormLink, courseLaunched: true });
	}

	editScorm = () => {
		this.setState({ showEditor: true });
	}

	onDismiss = () => {
		this.setState({ showEditor: false });
	}

	renderInstructor = () => {
		const { showEditor, courseLaunched } = this.state;
		const { bundle } = this.props;

		return (
			<div className="scorm-card scorm-instructor-card">
				<div className="scorm-title">{bundle.title}</div >
				<a className="scorm-edit-link" onClick={this.editScorm}>Change Content Package</a>
				<div className="scorm-desc">
					This course uses an external website for displaying content.
					Follow the link below to access your course content.
					{courseLaunched && 'If you do not see it after, a popup blocker may be preventing it from opening. Please disable popup blockers for this site.'}
				</div>
				{!courseLaunched && <Button className="scorm-launch-button" onClick={this.launchCourse}>Open</Button>}
				{courseLaunched && <Button className="scorm-post-launch-button" disabled>Already Open</Button>}
				{showEditor && <Editor onDismiss={this.onDismiss} bundle={this.props.bundle} />}
			</div>
		);
	}

	renderStudent = () => {
		const { bundle } = this.props;
		const { courseLaunched } = this.state;

		return (
			<div className="scorm-card scorm-student-card">
				<div className="scorm-student-progress">
					<div className="scorm-title">{ bundle.title }</div>
					<div className="scorm-desc">
						This course uses an external website for displaying content.
						Follow the link below to access your course content. 
						{courseLaunched && 'If you do not see it after, a popup blocker may be preventing it from opening. Please disable popup blockers for this site.'}
					</div>
					{!courseLaunched && <Button className="scorm-launch-button" onClick={this.launchCourse}>Open</Button>}
					{courseLaunched && <Button className="scorm-post-launch-button" disabled>Already Open</Button>}
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
					{this.state.scormLink !== '' && <iframe className="scorm-container" src={this.state.scormLink} />}
					{!isInstructor && this.renderStudent()}
					{isInstructor && this.renderInstructor()}
				</div>
			</div>
		);
	}
}

export default Scorm;