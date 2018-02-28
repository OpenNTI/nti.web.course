import React from 'react';
import PropTypes from 'prop-types';

import Items from '../View';

LessonOverviewGroupGrid.propTypes = {
	item: PropTypes.object
};
export default function LessonOverviewGroupGrid ({item, ...otherProps}) {
	const {title, accentColor, Items:items} = item;

	return (
		<div className="lesson-overview-group-grid">
			<h2 style={{backgroundColor: `#${accentColor}`}}>{title}</h2>
			<Items items={items} {...otherProps} />
		</div>
	);
}
