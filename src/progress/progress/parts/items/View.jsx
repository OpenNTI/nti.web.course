import './View.scss';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Registry from './Registry';

const registry = Registry.getInstance();

CourseProgressItems.propTypes = {
	items: PropTypes.array,
	className: PropTypes.string,
};
export default function CourseProgressItems({
	items,
	className,
	...otherProps
}) {
	return (
		<ul className={cx('course-progress-items', className)}>
			{items.map((item, index) => {
				const Cmp = registry.getItemFor(item.MimeType);

				return <Cmp key={index} item={item} {...otherProps} />;
			})}
		</ul>
	);
}
