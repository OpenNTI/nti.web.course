import React from 'react';
import PropTypes from 'prop-types';
import {Component as Video} from 'nti-web-video';
import {Error as ErrorWidget, Loading} from 'nti-web-commons';
import {LinkTo} from 'nti-web-routing';

import Required from '../../common/Required';
import {block} from '../../../../utils';

const initialState = {
	loading: false,
	error: false,
	poster: null,
	playing: false,
	video: false
};

export default class LessonOverviewVideoGrid extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
		course: PropTypes.object.isRequired,
		// outlineNode: PropTypes.object.isRequired,
		overview: PropTypes.object.isRequired,

		activeIndex: PropTypes.number,
		index: PropTypes.number,
		touching: PropTypes.bool
	}

	state = initialState


	attachVideoRef = x => this.video = x


	getID (props = this.props) {
		let {NTIID, ntiid} = props.item;
		return NTIID || ntiid;
	}


	componentDidMount () {
		this.fillInVideo(this.props);
	}


	componentWillReceiveProps (nextProps) {
		if (this.getID() !== this.getID(nextProps)) {
			this.fillInVideo(nextProps);
		}

		if (this.props.activeIndex !== nextProps.activeIndex) {
			this.setState({playing: false});
		}
	}


	onError (error) {
		this.setState({
			...initialState,
			error
		});
	}


	fillInVideo ({item, course, overview} = this.props) {
		const task = {};
		this.activeTask = task;

		const load = async () => {
			if (this.activeTask !== task) {
				return;
			}

			// The "item" is now going to be a full Video object, we no longer have to look it up.
			// Simply Parse/Present the video w/o looking it up in the VideoIndex
			// const v = item; //(await course.getVideoIndex()).get(id);

			try {
				const v = item.sources != null ? item : (await course.getVideoIndex()).get(item.getID());
				const poster = await (v ? v.getPoster() : Promise.resolve(null));

				if (this.activeTask !== task) {
					return;
				}

				this.setState({
					poster,
					loading: false,
					video: v,
					context: [
						course.getID(),
						overview && overview.getID(),
						v.getID()
					].filter(x => x)
				});
			} catch (e) {
				this.onError(e);
			}

			delete this.activeTask;
		};

		this.setState({...initialState, loading: true});
		load();
	}


	onPlayClicked = (e) => {
		block(e);
		const {video} = this;
		if (video) {
			video.play();
		}
	}


	updateCompletedState () {
		const {item} = this.props;

		if (item.updateCompletedState) {
			item.updateCompletedState();
		}
	}


	stop = () => {
		const {video} = this;
		if (video) {
			video.stop();
		}
	}


	onStop = () => {
		this.setState({playing: false});
		this.updateCompletedState();
	}


	onPlay = () => {
		this.setState({playing: true});
	}


	onTouchMove = () => {
		this.setState({playing: false});
		this.updateCompletedState();
	}


	render () {
		const {
			activeIndex,
			index,
			touching,
			item,
		} = this.props;

		const {loading, context, video, poster, playing, error} = this.state;


		const style = poster && { backgroundImage: 'url(' + poster + ')' };

		let renderVideoFully = !touching;
		if (activeIndex != null) {
			renderVideoFully = (!touching && activeIndex === index);
		}


		const viewed = item.hasCompleted && item.hasCompleted();

		const link = '#';//path.join('videos', encodeForURI(this.getID())) + '/';


		const required = item.CompletionRequired;

		const label = item.title || item.label;

		return (
			<div className="lesson-overview-video-container" onTouchMove={this.onTouchMove} data-ntiid={item.NTIID}>
				{error && (
					<ErrorWidget error={error}/>
				)}
				{(error || !video || !renderVideoFully) ? null : (
					<Video
						ref={this.attachVideoRef}
						src={video}
						onEnded={this.onStop}
						onPlaying={this.onPlay}
						analyticsData={{
							resourceId: video.getID(),
							context
						}}
					/>
				)}
				{(error || playing) ? null : (
					<LinkTo.Object object={item}>
						<Loading.Mask loading={loading}
							style={style}
							className="overview-video-tap-area" href={link}
						>
							<div className="video-badges">
								{(!viewed && required) && <Required className="badge"/>}
								{viewed && <div className="badge viewed">Viewed</div>}
							</div>
							<div className="wrapper">
								<div className="buttons">
									<span className="play" title="Play" onClick={this.onPlayClicked}/>
									<span className="label" title={label}>{label}</span>
								</div>
							</div>
						</Loading.Mask>
					</LinkTo.Object>
				)}
			</div>
		);
	}
}
