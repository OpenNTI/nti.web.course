import React from 'react';
import PropTypes from 'prop-types';

import Video, { EmbedInput, getCanonicalUrlFrom } from '@nti/web-video';
import { Prompt } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import { Button, Icons } from '@nti/web-core';

const t = scoped('course.info.inline.widgets.CourseVideo', {
	change: 'Change',
	remove: 'Remove',
});

const setVideoInput = async setVideo => {
	const value = await EmbedInput.show();
	if (value) {
		setVideo?.(getCanonicalUrlFrom(value));
	}
};

const removeVideoValue = async removeVideo => {
	try {
		await Prompt.areYouSure('This will remove this video from the course');
		removeVideo?.();
	} catch {
		// sigh... this prompt rejects on cancel
	}
};

CourseVideo.propTypes = {
	catalogEntry: PropTypes.object.isRequired,
	editable: PropTypes.bool,
	onSetVideo: PropTypes.func,
	onRemoveVideo: PropTypes.func,
};

//#region paint

const Box = styled.div`
	position: relative;
`;

const Icon = styled.span`
	--size: 16px;

	background-color: white;
	color: #333;
	width: var(--size);
	height: var(--size);
	border-radius: var(--size);
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Pill = styled(Button).attrs({ plain: true })`
	background-color: #333;
	border-radius: 16px;
	padding: 7px 10px;
	font-size: 12px;
	cursor: pointer;
	color: white;

	[data-button-label] {
		align-items: center;
		display: flex;
		gap: 4px;
	}
`;

const Controls = styled.div`
	padding: 10px;
	background-color: white;
	display: flex;
	flex-direction: row-reverse;
	gap: 12px;
`;

//#endregion

export default function CourseVideo({
	catalogEntry,
	editable,
	onSetVideo,
	onRemoveVideo,
}) {
	const setVideo = setVideoInput.bind(null, onSetVideo);
	const removeVideo = removeVideoValue.bind(null, onRemoveVideo);

	return catalogEntry?.Video ? (
		<Box className="course-video-container">
			<Video src={catalogEntry.Video} />
			{!editable ? null : (
				<Controls>
					<Pill data-testid="remove" onClick={removeVideo}>
						<Icon>
							<Icons.X.Bold />
						</Icon>
						{t('remove')}
					</Pill>
					<Pill data-testid="change" onClick={setVideo}>
						<Icon>
							<Icons.Add />
						</Icon>
						{t('change')}
					</Pill>
				</Controls>
			)}
		</Box>
	) : editable ? (
		<VideoPlaceholder
			className="course-info-video-editor"
			data-testid="set-course-video"
			onClick={setVideo}
		/>
	) : null;
}

//#region placeholder
const VideoPlaceholderFrame = styled.div`
	background-color: #333;
	height: 432px;
	width: 768px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const VideoPlaceholderTriggerIcon = styled.div`
	width: 90px;
	height: 60px;
	border: solid 2px #979797;
	color: #979797;
	margin: 0 auto 20px;
	border-radius: 4px;
	font-size: 40px;
`;

const VideoPlaceholderTrigger = styled(Button).attrs({ plain: true })`
	width: 170px;
	background-color: #444;
	border-radius: 5px;
	margin: 0 auto;
	padding: 20px 0 10px;
	cursor: pointer;
	color: var(--tertiary-grey);
`;

function VideoPlaceholder(props) {
	return (
		<VideoPlaceholderFrame className="course-info-video-editor">
			<VideoPlaceholderTrigger {...props}>
				<VideoPlaceholderTriggerIcon>+</VideoPlaceholderTriggerIcon>
				<div>Cover Video</div>
			</VideoPlaceholderTrigger>
		</VideoPlaceholderFrame>
	);
}

//#endregion
