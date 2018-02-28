import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Registry from './Registry';

const registry = Registry.getInstance();

LessonOverviewItems.propTypes = {
	className: PropTypes.string,
	containerProps: PropTypes.object,
	items: PropTypes.array,
	itemRef: PropTypes.func
};
export default function LessonOverviewItems ({className, containerProps = {}, items, itemRef, ...otherProps}) {

	return (
		<ul {...containerProps} className={cx('lesson-overview-items', className)}>
			{items.map((item, key) => {
				const Cmp = registry.getItemFor(item.MimeType);

				if (itemRef) {
					otherProps.ref = (x) => itemRef(key, x);
				}

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
