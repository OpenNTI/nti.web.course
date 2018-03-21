import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from 'nti-web-commons';

import Base from '../../common/BaseListItem';

export default class LessonOverviewVideoListItem extends React.Component {
	static propTypes = {
		item: PropTypes.object
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


	async setupFor (props) {
		const {item} = this.props;

		try {
			const thumb = await item.getThumbnail();
			const duration = await item.getDuration();

			this.setState({thumb, duration});
		} catch (e) {
			//Its alright if it fails. Nothing to do here
		}
	}

	render () {
		const {item, ...otherProps} = this.props;
		const {duration} = this.state;
		const formattedDuration = duration != null ? DateTime.formatDuration(duration) : '';
		const required = item['CompletionRequired'];

		let labels = [formattedDuration];

		if(required) {
			labels.push('Required');
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
				{thumb && (<img src={thumb} />)}
			</div>
		);
	}
}
