import './List.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from '@nti/web-commons';
import { Poster } from '@nti/web-video';

import Base from '../../common/BaseListItem';
import Required from '../../common/Required';

export default class LessonOverviewVideoListItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		course: PropTypes.object,
	};

	state = { poster: null };

	componentDidMount() {
		this.setupFor(this.props);
	}

	componentWillUnmount() {
		this.unmounted = this;
		this.setState = () => {};
	}

	componentDidUpdate(prevProps) {
		const { item: nextItem } = this.props;
		const { item: oldItem } = prevProps;

		if (nextItem !== oldItem) {
			this.setupFor(this.props);
		}
	}

	async setupFor(props) {
		const { item, course } = this.props;

		try {
			const v =
				item.sources != null
					? item
					: (await course.getVideoIndex()).get(item.getID());
			const thumb = await v.getThumbnail();
			const poster = await v.getPoster();
			const duration = await v.getDuration();

			this.setState({ thumb: thumb || poster, duration });
		} catch (e) {
			//Its alright if it fails. Nothing to do here
		}
	}

	render() {
		const { item, ...otherProps } = this.props;
		const { duration } = this.state;
		const formattedDuration =
			duration != null ? DateTime.formatDuration(duration) : '';
		const required = item.CompletionRequired;

		let labels = [];

		if (required) {
			labels.push(<Required key="required-label" />);
		}

		if (formattedDuration) {
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
		const { item } = this.props;

		return (
			<Poster
				className="lesson-overview-video-list-item-icon"
				video={item}
				progress={item.getPercentageCompleted()}
			/>
		);
	};
}
