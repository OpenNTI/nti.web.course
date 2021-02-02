import './Carousel.scss';
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {Error as ErrorWidget, Loading} from '@nti/web-commons';
import Logger from '@nti/util-logger';

import {block, stop} from '../../../../utils';
import View from '../View';

const initialState = {
	active: 0,
	loading: true,
	error: false,
	pixelOffset: 0
};


const logger = Logger.get('course:overview:lesson:items:VideoRollCarousel');

/**
 * The mobile form of the Video Roll.
 */

export default class VideoRollCarousel extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		item: PropTypes.object,
	}

	state = initialState

	attachRef = x => this.videos = x
	attachItemRef = (key, x) => {
		key = `video-${key}`;
		delete this[key];
		if (x) {
			this[key] = x;
		}
	}

	getVideoList () {
		return this.props.item.Items;
	}

	componentWillUnmount () {
		this.unmounted = true;
	}

	componentDidMount () {
		this.getDataIfNeeded(this.props);
	}


	componentDidUpdate (prevProps) {
		const {videos, state: {offsetWidth}} = this;
		const renderedOffsetWidth = videos && videos.offsetWidth;

		if (prevProps.item !== this.props.item) {
			this.getDataIfNeeded(this.props);
		}

		if (offsetWidth !== renderedOffsetWidth) {
			this.setState({offsetWidth: renderedOffsetWidth});
		}
	}


	onError (error) {
		if (!this.unmounted) {
			this.setState({
				loading: false,
				error: error,
				data: null
			});
		}
	}


	async getDataIfNeeded ({course}) {
		try {
			this.setState(initialState);
			const data = await course.getVideoIndex();
			if (this.unmounted) {
				throw new Error('late');
			}
			this.setState({loading: false, data});
		}
		catch(e) {
			this.onError(e);
		}
	}


	stopVideo () {
		for(let key of Object.keys(this)) {
			if (key.startsWith('video-') && this[key].stop) {
				this[key].stop();
			}
		}
	}


	onNext = (e) => {
		block(e);
		const {active} = this.state;
		this.stopVideo();
		this.setState({
			touch: null,
			active: Math.min(active + 1, this.getVideoList().length - 1)
		});
	}


	onPrev = (e) => {
		block(e);
		const {active} = this.state;
		this.stopVideo();
		this.setState({
			touch: null,
			active: Math.max(active - 1, 0)
		});
	}


	onActivateSlide = (e) => {
		block(e);
		const newActive = parseInt(e.target.getAttribute('data-index'), 10);
		this.stopVideo();
		this.setState({
			touch: null,
			active: newActive
		});
	}


	onTouchStart = (e) => {
		const [touch] = e.targetTouches;

		const active = this.state.active;
		const videos = this.videos;

		let pixelOffset = 0;

		if (videos) {
			pixelOffset = active * -videos.offsetWidth;
		}

		if (!this.state.touch) {
			stop(e);
			logger.debug('Touch Start...');
			this.setState({
				offsetWidth: videos.offsetWidth,
				touch: {
					dom: videos,
					pixelOffset: pixelOffset,
					startPixelOffset: 0,
					x: touch.clientX,
					y: touch.clientY,
					id: touch.identifier,
					sliding: 1,
					delta: 0
				}
			});
		}
	}


	onTouchMove = (e) => {

		const {state} = this;
		const {active, touch: data} = state;
		const find = (t, i) =>t || (i.identifier === state.touch.id && i);

		if (!data) {
			logger.debug('No touch data...ignoring.');
			return;
		}

		const touch = Array.from(e.targetTouches || []).reduce(find, null);

		let {sliding, pixelOffset, startPixelOffset} = data;

		let delta = 0;
		let touchPixelRatio = 1;

		if (touch) {
			e.stopPropagation();

			//Allow vertical scrolling
			if (Math.abs(touch.clientY - data.y) > Math.abs(touch.clientX - data.x)) {
				return;
			}

			e.preventDefault();

			delta = touch.clientX - data.x;
			if (sliding === 1 && delta) {
				sliding = 2;
				startPixelOffset = pixelOffset;
				logger.debug('Touch move tripped...');
			}

			if (sliding === 2) {
				if ((active === 0 && e.clientX > data.x) ||
					(active === (this.getVideoList().length - 1) && e.clientX < data.x)) {
					touchPixelRatio = 3;
				}

				pixelOffset = startPixelOffset + (delta / touchPixelRatio);

				// logger.debug('Touch move... %d %d %d', startPixelOffset, pixelOffset, delta);
				this.setState({
					touch: Object.assign(state.touch, {
						delta: delta,
						pixelOffset: pixelOffset,
						startPixelOffset: startPixelOffset,
						sliding: sliding
					})
				});
			}
		}
	}


	onTouchEnd = (e) => {
		const {touch = {}} = this.state;
		const find = (t, i) =>t || (i.identifier === touch.id && i);
		const endedTouch = Array.from(e.targetTouches || []).reduce(find, null);
		const {pixelOffset, startPixelOffset} = touch;

		if (touch.sliding === 2) {
			e.preventDefault();
			e.stopPropagation();

			const fn = (Math.abs(pixelOffset - startPixelOffset) / touch.dom.offsetWidth) < 0.35 ? null ://elastic
				pixelOffset < startPixelOffset ? 'onNext' : 'onPrev';

			logger.debug('Touch End, result: %s', fn || 'stay');

			if(fn) {
				this[fn]();
			}

			this.setState({ touch: null	});
		}

		if (endedTouch || e.targetTouches.length === 0) {
			this.setState({ touch: null	});
		} else {
			logger.debug('Not my touch', touch.id, e.targetTouches);
		}
	}


	getTranslation () {
		const {active = 0, touch, offsetWidth = 0} = this.state;
		const offset = touch
			? touch.pixelOffset
			: (active * -offsetWidth);

		return 'translate3d(' + offset + 'px,0,0)';
	}



	render () {
		const {item} = this.props;
		const {loading, error} = this.state;
		return (
			<div className="lesson-overview-video-roll-carousel-container" ref={this.attachRef} data-ntiid={item.NTIID}>
				{loading ? (
					<Loading.Mask/>
				) : error ? (
					<ErrorWidget error={error}/>
				) : (
					<Fragment>
						{this.renderCarousel()}
						<button className="prev icon-chevron-left" onClick={this.onPrev} title="Prevous Video"/>
						<button className="next icon-chevron-right" onClick={this.onNext} title="Next Video"/>
						<ul className="videos-carousel-dots">
							{this.renderDots()}
						</ul>
					</Fragment>
				)}
			</div>
		);
	}


	renderDots () {
		return this.getVideoList().map((_, i) => {
			const active = (i === (this.state.active || 0)) ? 'active' : null;

			return (
				<li key={'video-' + i}>
					<a className={active} href={'#' + i} onClick={this.onActivateSlide} data-index={i}/>
				</li>
			);
		});
	}


	renderCarousel () {
		const {touch} = this.state;
		const touching = (touch && touch.sliding !== 1);
		const animateChanges = touching ? '' : 'animate';
		const translation = this.getTranslation();

		const props = {
			...this.props,

			touching,
			className: 'videos-carousel ' + animateChanges,
			items: this.getVideoList(),
			activeIndex: this.state.active,
			itemRef: this.attachItemRef,

			containerProps: {
				tabIndex: '0',
				style: {
					WebkitTransform: translation,
					MozTransform: translation,
					msTransform: translation,
					transform: translation
				},
				onTouchStart: this.onTouchStart,
				onTouchMove: this.onTouchMove,
				onTouchEnd: this.onTouchEnd,
			}
		};

		return (
			<View {...props}/>
		);

	}
}
