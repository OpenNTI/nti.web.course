import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Registry from './Registry';

const registry = Registry.getInstance();

LessonOverviewItems.propTypes = {
	className: PropTypes.string,
	items: PropTypes.array
};
export default function LessonOverviewItems ({className, items, ...otherProps}) {
	return (
		<ul className={cx('lesson-overview-items', className)}>
			{items.map((item, key) => {
				const Cmp = registry.getItemFor(item.MimeType);

				return (
					<li key={key}>
						{!Cmp && (<span>Missing Item: {item.MimeType}</span>)}
						{Cmp && (<Cmp item={item} {...otherProps} />)}
					</li>
				);
			})}
		</ul>
	);
}
