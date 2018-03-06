import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

LessonOverviewDiscussionGridItem.propTypes = {
	disabled: PropTypes.bool,
	item: PropTypes.object,
	icon: PropTypes.string,
	title: PropTypes.string,
	commentLabel: PropTypes.string,
};
export default function LessonOverviewDiscussionGridItem ({disabled, item, icon, title, commentLabel}) {

	title = title || 'Discussion';


	const img = icon ? {backgroundImage: `url(${icon})`} : null;
	const href = '#';

	return (
		<a href={href} className={cx('lesson-overview-discussion-grid-item', {unavailable: disabled})}>
			<div style={img} className={cx('icon', {'default': !icon})} />
			<div className="wrap">
				<div className="title">{title}</div>
				<div className="comments">{commentLabel}</div>
			</div>
		</a>
	);
}
