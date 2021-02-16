import './List.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Base from '../../common/BaseListItem';

export default class LessonOverviewDiscussionListItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		topic: PropTypes.object,

		title: PropTypes.string,
		commentLabel: PropTypes.string,
		disabled: PropTypes.bool,
		icon: PropTypes.string,
	};

	render() {
		const {
			item,
			title,
			commentLabel,
			disabled,
			topic,
			...otherProps
		} = this.props;

		return (
			<Base
				{...otherProps}
				linkToContext={{ topic }}
				className="lesson-overview-discussion-list-item"
				item={item}
				title={title}
				labels={commentLabel ? [commentLabel] : []}
				disabled={disabled}
				renderIcon={this.renderIcon}
			/>
		);
	}

	renderIcon = () => {
		const { icon } = this.props;

		const styles = icon ? { backgroundImage: `url(${icon})` } : {};

		return (
			<div
				className={cx('lesson-overview-discussion-list-item-icon', {
					default: !icon,
				})}
				style={styles}
			/>
		);
	};
}
