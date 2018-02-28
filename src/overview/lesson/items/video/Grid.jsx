import React from 'react';
import PropTypes from 'prop-types';
import {Progress} from 'nti-lib-interfaces';
import {Component as Video} from 'nti-web-video';
import {Error as ErrorWidget, Loading} from 'nti-web-commons';

const stop = e => e && e.stopPropagation();
const block = e => e && (stop(e), e.preventDefault());

const initialState = {
	loading: false,
	error: false,
	video: false
};

export default class LessonOverviewVideoGrid extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
		course: PropTypes.object.isRequired,

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


	async fillInVideo (props) {
		try {
			const {/*course,*/ item} = props;
			const {video} = this.state;
			const id = this.getID();

			if (video && id === video.getID()) {
				return;
			}

			this.setState({loading: true});
			// The "item" is now going to be a full Video object, we no longer have to look it up.
			// Simply Parse/Present the video w/o looking it up in the VideoIndex
			const v = item; //(await course.getVideoIndex()).get(id);

			const poster = await (v ? v.getPoster() : Promise.resolve(null));

			this.setState({loading: false, poster, video: v});

		} catch (e) {
			this.onError(e);
		}
	}


	onPlayClicked = (e) => {
		block(e);
		const {video} = this;
		if (video) {
			video.play();
		}
	}


	stop = (e) => {
		block(e);
		const {video} = this;
		if (video) {
			video.stop();
		}
	}


	onStop = (e) => {
		block(e);
		this.setState({playing: false});
	}


	onPlay = (e) => {
		block(e);
		this.setState({playing: true});
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


		const progress = item[Progress];
		const viewed = (progress && progress.hasProgress());

		const link = '#';//path.join('videos', encodeForURI(this.getID())) + '/';


		const label = item.title || item.label;

		return (
			<div className="lesson-overview-video-container">
				{error && (
					<ErrorWidget error={error}/>
				)}
				{(error || !video || !renderVideoFully) ? null : (
					<Video deferred
						ref={this.attachVideoRef}
						src={video}
						onEnded={this.onStop}
						onPlaying={this.onPlay}
						analyticsData={{
							context
						}}
					/>
				)}
				{(error || playing) ? null : (
					<Loading.Mask loading={loading}
						style={style}
						tag="a"
						className="overview-video-tap-area" href={link}>
						{viewed && <div className="viewed">Viewed</div>}
						<div className="wrapper">
							<div className="buttons">
								<span className="play" title="Play" onClick={this.onPlayClicked}/>
								<span className="label" title={label}>{label}</span>
							</div>
						</div>
					</Loading.Mask>
				)}
			</div>
		);
	}
}
