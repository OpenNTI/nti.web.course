import './Grid.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { Component as Video, Poster } from '@nti/web-video';
import { Error as ErrorWidget } from '@nti/web-commons';
import { LinkTo } from '@nti/web-routing';

import RequirementControl from '../../../../progress/widgets/RequirementControl';
import Required from '../../common/Required';
import { block } from '../../../../utils';

const initialState = {
	loading: false,
	error: false,
	poster: null,
	playing: false,
	video: false,
};

export default class LessonOverviewVideoGrid extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
		course: PropTypes.object.isRequired,
		// outlineNode: PropTypes.object.isRequired,
		overview: PropTypes.object.isRequired,
		noProgress: PropTypes.bool,

		activeIndex: PropTypes.number,
		index: PropTypes.number,
		touching: PropTypes.bool,
		onRequirementChange: PropTypes.func,
		inlinePlayback: PropTypes.bool,
		//
		badges: PropTypes.bool,
	};

	static defaultProps = {
		inlinePlayback: true,
		badges: true,
	};

	state = initialState;

	attachVideoRef = x => (this.video = x);

	getID(props = this.props) {
		let { NTIID, ntiid } = props.item;
		return NTIID || ntiid;
	}

	componentDidMount() {
		this.fillInVideo(this.props);
	}

	componentWillUnmount() {
		this.unmounted = true;
		this.setState = () => {};
	}

	componentDidUpdate(prevProps) {
		const { activeIndex: prevIndex } = prevProps;
		const { activeIndex } = this.props;

		if (this.getID() !== this.getID(prevProps)) {
			this.fillInVideo(this.props);
		}

		if (activeIndex !== prevIndex) {
			this.setState({ interacted: false, playing: false, error: null });
		}
	}

	onError = error => {
		if (!error.sourceWillChange) {
			this.setState({
				...initialState,
				error,
			});
		}
	};

	fillInVideo({ item, course, overview } = this.props) {
		const task = {};
		this.activeTask = task;

		const load = async () => {
			if (this.activeTask !== task || this.unmounted) {
				return;
			}

			// The "item" is now going to be a full Video object, we no longer have to look it up.
			// Simply Parse/Present the video w/o looking it up in the VideoIndex
			// const v = item; //(await course.getVideoIndex()).get(id);

			try {
				const v =
					item.sources != null
						? item
						: (await course.getVideoIndex()).get(item.getID());
				const poster = await (v
					? v.getPoster()
					: Promise.resolve(null));

				if (this.activeTask !== task || this.unmounted) {
					return;
				}

				this.setState({
					poster,
					loading: false,
					interacted: false,
					video: v,
					context: [
						course.getID(),
						overview && overview.getID(),
						v.getID(),
					].filter(x => x),
				});
			} catch (e) {
				this.onError(e);
			}

			delete this.activeTask;
		};

		this.setState({ ...initialState, loading: true });
		load();
	}

	onPlayClicked = e => {
		const { inlinePlayback } = this.props;

		if (!inlinePlayback) {
			return;
		}

		block(e);
		const { video } = this;
		this.setState({ interacted: true });
		if (video) {
			video.play();
		}
	};

	updateCompletedState() {
		const { item } = this.props;

		item.updateCompletedState?.();
	}

	stop = () => {
		const { video } = this;
		if (video) {
			video.stop();
		}
	};

	onStop = () => {
		this.setState({ playing: false });
		this.updateCompletedState();
	};

	onPlay = () => {
		this.setState({ playing: true });
	};

	render() {
		const {
			activeIndex,
			index,
			onRequirementChange,
			item,
			noProgress,
			badges: allowBadges,
		} = this.props;

		const { context, interacted, video, playing, error } = this.state;

		let renderVideoFully = true;

		if (activeIndex != null) {
			renderVideoFully = activeIndex === index;
		}

		const viewed = item.hasCompleted && item.hasCompleted();
		const required = item.CompletionRequired;

		const badges = [];

		if (allowBadges) {
			if (
				item &&
				item.isCompletable &&
				item.isCompletable() &&
				onRequirementChange
			) {
				badges.push(
					<RequirementControl
						key="requirement-control"
						record={item}
						onChange={onRequirementChange}
					/>
				);
			} else if (!viewed && required) {
				badges.push(<Required className="badge" key="required" />);
			}

			if (viewed && !noProgress) {
				badges.push(
					<div className="badge viewed" key="viewed">
						Viewed
					</div>
				);
			}
		}

		return (
			<div
				className="lesson-overview-video-container"
				data-ntiid={item.NTIID}
			>
				{error && (
					<ErrorWidget
						error={error}
						message="Unable to load video."
					/>
				)}
				{error || !video || !renderVideoFully ? null : (
					<Video
						deferred={!interacted}
						ref={this.attachVideoRef}
						src={video}
						onError={this.onError}
						onEnded={this.onStop}
						onPlaying={this.onPlay}
						analyticsData={{
							resourceId: video.getID(),
							context,
						}}
					/>
				)}
				{error || playing ? null : (
					<LinkTo.Object object={item}>
						<Poster
							className="overview-video-tap-area"
							video={item}
							progress={item.getPercentageCompleted()}
							badges={badges}
						/>
					</LinkTo.Object>
				)}
			</div>
		);
	}
}
