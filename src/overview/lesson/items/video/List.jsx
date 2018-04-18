import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from '@nti/web-commons';

import Base from '../../common/BaseListItem';
import Required from '../../common/Required';

export default class LessonOverviewVideoListItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		course: PropTypes.object
	}

	state = {poster: null}

	componentWillReceiveProps (nextProps) {
		const {item:nextItem} = nextProps;
		const {item:oldItem} = this.props;

		if (nextItem !== oldItem) {
			this.setupFor(nextProps);
		}
	}

	componentDidMount () {
		this.setupFor(this.props);
	}


	componentWillUnmount () {
		this.unmounted = this;
		this.setState = () => {};
	}


	async setupFor (props) {
		const {item, course} = this.props;

		try {
			const v = item.sources != null ? item : (await course.getVideoIndex()).get(item.getID());
			const thumb = await v.getThumbnail();
			const duration = await v.getDuration();

			this.setState({thumb, duration});
		} catch (e) {
			//Its alright if it fails. Nothing to do here
		}
	}

	render () {
		const {item, ...otherProps} = this.props;
		const {duration} = this.state;
		const formattedDuration = duration != null ? DateTime.formatDuration(duration) : '';
		const required = item.CompletionRequired;

		let labels = [];

		if(required) {
			labels.push(<Required key="required-label"/>);
		}

		if(formattedDuration) {
			labels.push(formattedDuration);
		}

		return (
			<Base
				{...otherProps}
				className="lesson-overview-video-list-item"
				item={item}
				renderIcon={this.renderIcon}
				labels={labels}
			/>
		);
	}


	renderIcon = () => {
		const {thumb} = this.state;

		return (
			<div className="lesson-overview-video-list-item-icon">
				{thumb && (
					<span className="thumb" style={{backgroundImage: `url(${thumb})`}} />
				)}
			</div>
		);
	}
}
