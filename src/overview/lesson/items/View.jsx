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
	const filtered = items.filter(x => x).filter(item => !!item || !registry.getItemFor(item.MimeType));

	return (
		<ul {...containerProps} className={cx('lesson-overview-items', className)}>
			{filtered.map((item, index) => {
				const Cmp = registry.getItemFor(item.MimeType);

				if (itemRef) {
					otherProps.ref = (x) => itemRef(index, x);
				}

				return (
					<li key={index} data-mime-type={item.MimeType}>
						{!Cmp && (<span>Missing Item: {item.MimeType}</span>)}
						{Cmp && (<Cmp {...otherProps} index={index} item={item}/>)}
					</li>
				);
			})}
		</ul>
	);
}
