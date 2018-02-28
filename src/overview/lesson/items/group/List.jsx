import React from 'react';
import PropTypes from 'prop-types';

import Items from '../View';

LessonOverviewGroupList.propTypes = {
	item: PropTypes.object
};
export default function LessonOverviewGroupList ({item, ...otherProps}) {
	const {Items:items} = item;

	return (
		<Items items={items} {...otherProps} />
	);
}
