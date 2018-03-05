import URL from 'url';
import {join} from 'path';

import React, { Component } from 'react';
import { Button } from 'nti-web-commons';
import PropTypes from 'prop-types';
import {resolveBasePath} from 'nti-web-client';

import Editor from './Editor';

const IMPORT_SCORM = 'ImportScorm';
const STATIC_REDIRECT = 'scormredirect.html';

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

	constructor (props) {
		super(props);

		const url = URL.parse(global.location.href);

		url.search = null;
		url.hash = null;
		url.query = null;
		url.pathname = join(resolveBasePath(), STATIC_REDIRECT);

		this.redirecturl = url.format();
	}

	componentDidMount () {
		window.addEventListener('message', this.onClose, false);
	}

	attachRef = (x) => {
		this.iframe = x;
	}

	onClose = (message) => {
		if(message) {
			let data;

			try {
				data = JSON.parse(message.data) || {};
			}
			catch (e) {
				data = {};
			}

			if('scorm-exit' === data.message) {
				this.setState({courseLaunched: false, scormLink: ''});
				return;
			}
		}
	}

	componentWillUnmount () {
		window.removeEventListener('message', this.onClose);
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

	renderFrame () {
		return (
			<iframe
				ref={this.attachRef}
				seamless="true"
				frameBorder="0"
				src={this.state.scormLink + '?redirecturl=' + encodeURIComponent(this.redirecturl)} />
		);
	}

	renderInstructor = () => {
		const { showEditor, courseLaunched, scormLink } = this.state;
		const { bundle } = this.props;

		return (
			<div className="scorm-card scorm-instructor-card">
				<div className="scorm-title">{bundle.title}</div>
				<a className="scorm-edit-link" onClick={this.editScorm}>Change Content Package</a>
				<div className="scorm-desc">
					This course uses an external website for displaying content.
					Follow the link below to access your course content.
					{courseLaunched && 'If you do not see it after, a popup blocker may be preventing it from opening. Please disable popup blockers for this site.'}
				</div>
				{!courseLaunched && <Button className="scorm-launch-button" onClick={this.launchCourse}>Open</Button>}
				{scormLink !== '' && this.renderFrame()}
				{courseLaunched && !scormLink && <Button className="scorm-post-launch-button" disabled>Already Open</Button>}
				{showEditor && <Editor onDismiss={this.onDismiss} bundle={this.props.bundle} />}
			</div>
		);
	}

	renderStudent = () => {
		const { bundle } = this.props;
		const { courseLaunched, scormLink } = this.state;

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
					{scormLink !== '' && this.renderFrame()}
					{courseLaunched && !scormLink && <Button className="scorm-post-launch-button" disabled>Already Open</Button>}
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
