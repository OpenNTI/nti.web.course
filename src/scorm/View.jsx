import React, { Component } from 'react';
import { Button } from 'nti-web-commons';
import PropTypes from 'prop-types';

import Editor from './Editor';

const IMPORT_SCORM = 'ImportScorm';

class Scorm extends Component {
	static propTypes = {
		bundle: PropTypes.shape({
			getScormCourse: PropTypes.func.isRequired
		})
	}

	state = {
		scormLink: '',
		showEditor: false
	}

	componentWillMount () {
		this.setState({ scormLink: '', showEditor: false });
	}

	launchCourse = async (e) => {
		e.preventDefault();

		const { bundle } = this.props;
		const scormLink = await bundle.getScormCourse();

		this.setState({ scormLink });
	}

	editScorm = () => {
		this.setState({ showEditor: true });
	}

	onDismiss = () => {
		this.setState({ showEditor: false });
	}

	renderEditing = () => {
		const { showEditor } = this.state;
		const { bundle } = this.props;
		const canEdit = bundle.hasLink(IMPORT_SCORM);

		return (
			<div>
				{canEdit && <Button className="scorm-edit-button" onClick={this.editScorm}>Import Scorm Package</Button>}
				{showEditor && <Editor onDismiss={this.onDismiss} importLink={bundle.getLink(IMPORT_SCORM)} />}
			</div>
		);
	}

	render () {
		return (
			<div className="scorm-overview-body">
				<div className="scorm-content">
					{this.state.scormLink !== '' && <iframe className="scorm-container" src={this.state.scormLink} />}
					<Button className="scorm-launch-button" onClick={this.launchCourse}>Launch Course</Button>
					{this.renderEditing()}
				</div>
			</div>
		);
	}
}

export default Scorm;