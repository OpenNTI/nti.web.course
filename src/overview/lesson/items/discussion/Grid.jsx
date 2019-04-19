import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {LinkTo} from '@nti/web-routing';

LessonOverviewDiscussionGridItem.propTypes = {
	disabled: PropTypes.bool,
	item: PropTypes.object,
	topic: PropTypes.object,
	icon: PropTypes.string,
	title: PropTypes.string,
	commentLabel: PropTypes.string,
};
export default function LessonOverviewDiscussionGridItem ({disabled, item, icon, title, commentLabel, topic}) {
	const img = icon ? {backgroundImage: `url(${icon})`} : null;

	return (
		<LinkTo.Object object={item} context={{topic}} data-ntiid={item.NTIID} className={cx('lesson-overview-discussion-link', { disabled: disabled })}>
			<div className={cx('lesson-overview-discussion-grid-item', {unavailable: disabled})}>
				<div style={img} className={cx('icon', {'default': !icon})} />
				<div className="wrap">
					<div className="title">{title || 'Discussion'}</div>
					<div className="comments">{commentLabel}</div>
				</div>
			</div>
		</LinkTo.Object>
	);
}
