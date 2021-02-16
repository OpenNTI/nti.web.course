import './Video.scss';
import React from 'react';
import PropTypes from 'prop-types';

import Registry from './Registry';
import Base from './Base';

export default class VideoProgressItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
	};

	state = { poster: null };

	async componentDidMount() {
		const { item } = this.props;

		try {
			const thumb = await item.getPoster();

			this.setState({ thumb });
		} catch (e) {
			//Its alright if it fails. Nothing to do here
		}
	}

	render() {
		const { item } = this.props;

		return (
			<Base
				className="video-progress-item"
				item={item}
				renderIcon={this.renderIcon}
			/>
		);
	}

	renderIcon = () => {
		const { thumb } = this.state;

		return (
			<div className="video-progress-item-icon">
				{thumb && <img src={thumb} />}
			</div>
		);
	};
}

Registry.register('application/vnd.nextthought.ntivideo')(VideoProgressItem);
