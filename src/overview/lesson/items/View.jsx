import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Item from './Item';

LessonOverviewItems.propTypes = {
	className: PropTypes.string,
	containerProps: PropTypes.object,
	items: PropTypes.array
};
export default function LessonOverviewItems ({className, containerProps = {}, items, ...otherProps}) {
	const filtered = items.filter(item => item && Item.canRender(item));

	return (
		<ul {...containerProps} className={cx('lesson-overview-items', className)}>
			{filtered.map((item, index) => {
				return (
					<li key={index} data-mime-type={item.MimeType}>
						<Item {...otherProps} item={item} index={index}/>
					</li>
				);
			})}
		</ul>
	);
}
