import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Item from './Item';

const List = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
`;

LessonOverviewItems.propTypes = {
	className: PropTypes.string,
	itemClassName: PropTypes.string,
	containerProps: PropTypes.object,
	items: PropTypes.array,
};
export default function LessonOverviewItems({
	className,
	containerProps = {},
	itemClassName,
	items,
	...otherProps
}) {
	const filtered = items.filter(item => item && Item.canRender(item));

	return (
		<List
			{...containerProps}
			className={cx('lesson-overview-items', className)}
		>
			{filtered.map((item, index) => {
				return (
					<li key={index} data-mime-type={item.MimeType}>
						<Item
							{...otherProps}
							item={item}
							index={index}
							className={itemClassName}
						/>
					</li>
				);
			})}
		</List>
	);
}
