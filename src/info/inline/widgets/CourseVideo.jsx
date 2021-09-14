import './CourseVideo.scss';
import React from 'react';
import PropTypes from 'prop-types';

import Video, { EmbedInput, getCanonicalUrlFrom } from '@nti/web-video';
import { Prompt } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

const t = scoped('course.info.inline.widgets.CourseVideo', {
	change: 'Change',
	remove: 'Remove',
});

export default class CourseVideo extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		editable: PropTypes.bool,
		onSetVideo: PropTypes.func,
		onRemoveVideo: PropTypes.func,
	};

	launchVideoInput = async () => {
		const value = await EmbedInput.show();
		if (value) {
			this.props.onSetVideo?.(getCanonicalUrlFrom(value));
		}
	};

	renderVideoEditor() {
		const { editable } = this.props;

		if (editable) {
			return (
				<div className="course-info-video-editor">
					<div
						className="video-button"
						onClick={this.launchVideoInput}
					>
						<div className="icon">+</div>
						<div className="label">Cover Video</div>
					</div>
				</div>
			);
		}

		return null;
	}

	removeVideo = () => {
		Prompt.areYouSure('This will remove this video from the course').then(
			() => {
				const { onRemoveVideo } = this.props;

				onRemoveVideo && onRemoveVideo();
			}
		);
	};

	renderVideoControls() {
		const { editable } = this.props;

		if (editable) {
			return (
				<div className="admin-controls">
					<div className="buttons">
						<div className="change" onClick={this.launchVideoInput}>
							<i className="icon-add" />
							{t('change')}
						</div>
						<div className="remove" onClick={this.removeVideo}>
							<i className="icon-remove" />
							{t('remove')}
						</div>
					</div>
				</div>
			);
		}

		return null;
	}

	render() {
		const { catalogEntry } = this.props;

		if (catalogEntry.Video) {
			return (
				<div className="course-video-container">
					<Video src={catalogEntry.Video} />
					{this.renderVideoControls()}
				</div>
			);
		} else {
			return this.renderVideoEditor();
		}
	}
}
