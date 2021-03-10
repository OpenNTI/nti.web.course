import './PlaylistItem.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { DateTime, List } from '@nti/web-commons';

import RequirementControl from '../../../../progress/widgets/RequirementControl';
import { block } from '../../../../utils';

export default class PlaylistItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		onClick: PropTypes.func,
		selected: PropTypes.bool,
		noProgress: PropTypes.bool,
		onRequirementChange: PropTypes.func,
	};

	state = {};

	componentDidMount() {
		this.resolveDuration();
	}

	componentWillUnmount() {
		this.unmounted = true;
		this.setState = () => {};
	}

	componentDidUpdate(prevProps) {
		if (this.props.item !== prevProps.item) {
			this.resolveDuration();
		}
	}

	async resolveDuration({ item } = this.props) {
		try {
			const duration = await item.getDuration();
			this.setState({ duration });
		} catch (e) {
			//let it be...
		}
	}

	onClick = e => {
		block(e);
		const { onClick, item } = this.props;
		if (onClick) {
			onClick(item);
		}
	};

	requirementChange = val => {
		const { onRequirementChange, item } = this.props;

		if (onRequirementChange) {
			onRequirementChange(val, item);
		}
	};

	render() {
		const {
			props: { item, selected, onRequirementChange, noProgress },
			state: { duration },
		} = this;

		const required = item.CompletionRequired;
		const viewed = item.hasCompleted && item.hasCompleted();
		const formattedDuration =
			duration != null ? DateTime.formatDuration(duration) : '';

		return (
			<li
				className={cx('lesson-overview-video-roll-playlist-item', {
					selected,
					required,
					viewed: viewed && !noProgress,
				})}
				onClick={this.onClick}
				data-ntiid={item.NTIID}
			>
				<a href={item.getID()} onClick={this.onClick}>
					<div className="label-container">
						<div className="video-info">
							<span className="label">
								{item.title || item.label}
							</span>
							<span className="meta">
								<List.SeparatedInline>
									{formattedDuration}
									{item &&
									item.isCompletable &&
									item.isCompletable() &&
									onRequirementChange ? (
										<RequirementControl
											record={item}
											onChange={this.requirementChange}
										/>
									) : (
										required && 'Required'
									)}
									{viewed && !noProgress && 'Viewed'}
								</List.SeparatedInline>
							</span>
						</div>
					</div>
				</a>
			</li>
		);
	}
}
