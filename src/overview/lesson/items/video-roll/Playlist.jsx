import './Playlist.scss';
import React from 'react';
import PropTypes from 'prop-types';

import Video from '../video/Grid';
import CompletionMonitor from '../../common/CompletionMonitor';

import PlaylistItem from './PlaylistItem';

export default class VideoRollPlaylist extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		item: PropTypes.object,
		onRequirementChange: PropTypes.func,
		readOnly: PropTypes.bool,
		editMode: PropTypes.bool,
		noProgress: PropTypes.bool
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
				item: {Items: items, NTIID},
				readOnly,
				editMode,
				noProgress,
				onRequirementChange
			},
			state: {
				selected
			}
		} = this;

		const active = items[selected];

		return (
			<div className="lesson-overview-video-roll-playlist-container" data-ntiid={NTIID}>
				<div className="stage">
					<CompletionMonitor {...this.props} item={active} component={Video} />
				</div>
				<ul className="playlist">
					{items.map((x => (
						<CompletionMonitor
							item={x}
							component={PlaylistItem}
							key={x.getID()}
							selected={active === x}
							onClick={this.handleSelect}
							onRequirementChange={onRequirementChange}
							readOnly={readOnly}
							editMode={editMode}
							noProgress={noProgress}
						/>
					)))}
				</ul>
			</div>
		);
	}
}
