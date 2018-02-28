import React from 'react';
import PropTypes from 'prop-types';

export default class VideoRollPlaylist extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		item: PropTypes.object,
	}

	render () {
		return (
			<div>Video Roll Playlist</div>
		);
	}
}
