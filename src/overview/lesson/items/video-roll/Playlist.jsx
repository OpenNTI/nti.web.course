import React from 'react';
import PropTypes from 'prop-types';

import Video from '../video/Grid';

import PlaylistItem from './PlaylistItem';

export default class VideoRollPlaylist extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		item: PropTypes.object,
	}

	state = {
		selected: 0
	}

	handleSelect = (item) => {
		const {item: {Items: items}} = this.props;
		const selected = items.indexOf(item);
		this.setState({selected});
	}

	render () {
		const {
			props: {
				item: {Items: items, NTIID}
			},
			state: {
				selected
			}
		} = this;

		const active = items[selected];

		return (
			<div className="lesson-overview-video-roll-playlist-container" data-ntiid={NTIID}>
				<div className="stage">
					<Video {...this.props} item={active}/>
				</div>
				<ul className="playlist">
					{items.map((x => (
						<PlaylistItem
							key={x.getID()}
							selected={active === x}
							item={x}
							onClick={this.handleSelect}
						/>
					)))}
				</ul>
			</div>
		);
	}
}
