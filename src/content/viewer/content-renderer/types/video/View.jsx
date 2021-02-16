import React from 'react';
import PropTypes from 'prop-types';
import { TranscriptedVideo } from '@nti/web-content';

import TypeRegistry from '../Registry';

const MIME_TYPES = {
	'application/vnd.nextthought.ntivideo': true,
};

const handles = obj => {
	const { location } = obj || {};
	const { item } = location || {};

	return item && MIME_TYPES[item.MimeType];
};

export default class CourseContentViewerRendererVideo extends React.Component {
	static propTypes = {
		location: PropTypes.shape({
			item: PropTypes.object,
		}),
		course: PropTypes.object,
	};

	render() {
		const { location, course } = this.props;
		const { item } = location || {};

		if (!item) {
			return null;
		}

		return <TranscriptedVideo course={course} videoId={item.getID()} />;
	}
}

TypeRegistry.register(handles)(CourseContentViewerRendererVideo);
