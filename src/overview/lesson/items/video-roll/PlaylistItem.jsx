import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Progress} from 'nti-lib-interfaces';
import {DateTime, List} from 'nti-web-commons';

import GridCompleteIcon from '../../common/GridCompleteIcon';
import {block} from '../../../../utils';

export default class PlaylistItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		onClick: PropTypes.func,
		selected: PropTypes.bool
	}

	state = {}


	componentDidMount () {
		this.resolveDuration();
	}


	componentWillReceiveProps (nextProps) {
		if (this.props.item !== nextProps.item) {
			this.resolveDuration(nextProps);
		}
	}


	async resolveDuration ({item} = this.props) {
		try {
			const duration = await item.getDuration();
			this.setState({duration});
		} catch (e) {
			//let it be...
		}
	}


	onClick = (e) => {
		block(e);
		const {onClick, item} = this.props;
		if (onClick) {
			onClick(item);
		}
	}

	renderCompleteIcon () {
		if(!this.props.item.CompletedDate) {
			return null;
		}

		return (
			<div className="completable">
				<GridCompleteIcon/>
			</div>
		);
	}


	render () {
		const {
			props: {item, selected},
			state: {duration}
		} = this;

		const progress = item[Progress];
		const required = item['CompletionRequired'];
		const viewed = (progress && progress.hasProgress());
		const formattedDuration = duration != null ? DateTime.formatDuration(duration) : '';

		return (
			<li className={cx('lesson-overview-video-roll-playlist-item', {selected, required, viewed})}  onClick={this.onClick} data-ntiid={item.NTIID}>
				<a href={item.getID()} onClick={this.onClick}>
					<div className="label-container">
						{this.renderCompleteIcon()}
						<div className="video-info">
							<span className="label">{item.title || item.label}</span>
							<span className="meta">
								<List.SeparatedInline>
									{formattedDuration}
									{required && ('Required')}
									{viewed && ('Viewed')}
								</List.SeparatedInline>
							</span>
						</div>
					</div>
				</a>
			</li>
		);
	}
}
