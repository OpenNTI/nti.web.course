import PropTypes from 'prop-types';

import Items from '../View';

LessonOverviewVideoRollList.propTypes = {
	item: PropTypes.object,
};
export default function LessonOverviewVideoRollList({ item, ...otherProps }) {
	const { Items: items } = item;

	return <Items items={items} {...otherProps} />;
}
