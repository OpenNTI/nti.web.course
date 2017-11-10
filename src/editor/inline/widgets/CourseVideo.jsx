import React from 'react';
import PropTypes from 'prop-types';
import Video, { EmbedInput, getCanonicalUrlFrom } from 'nti-web-video';
import { Prompt } from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

const LABELS = {
	change: 'Change',
	remove: 'Remove'
};

const t = scoped('components.course.editor.inline.widgets.coursevideo', LABELS);

export default class CourseVideo extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		editable: PropTypes.bool,
		onSetVideo: PropTypes.func,
		onRemoveVideo: PropTypes.func
	}

	launchVideoInput = () => {
		EmbedInput.show().then((value) => {
			const src = getCanonicalUrlFrom(value);

			const { onSetVideo } = this.props;

			onSetVideo && onSetVideo(src);
		});
	}

	renderVideoEditor () {
		const { editable } = this.props;

		if(editable) {
			return (
				<div className="course-video-editor">
					<div className="video-button" onClick={this.launchVideoInput}>
						<div className="icon">+</div>
						<div className="label">Cover Video</div>
					</div>
				</div>
			);
		}

		return null;
	}

	removeVideo = () => {
		Prompt.areYouSure('This will remove this video from the course').then(() => {
			const { onRemoveVideo } = this.props;

			onRemoveVideo && onRemoveVideo();
		});
	}

	renderVideoControls () {
		const { editable } = this.props;

		if(editable) {
			return (
				<div className="controls">
					<div className="change" onClick={this.launchVideoInput}><i className="icon-add"/>{t('change')}</div>
					<div className="remove" onClick={this.removeVideo}><i className="icon-remove"/>{t('remove')}</div>
				</div>
			);
		}

		return null;
	}

	render () {
		const { catalogEntry } = this.props;

		if(catalogEntry.Video) {
			return (
				<div className="course-video-container">
					{this.renderVideoControls()}
					<Video src={catalogEntry.Video}/>
				</div>
			);
		}
		else {
			return this.renderVideoEditor();
		}
	}
}
