import React from 'react';
import PropTypes from 'prop-types';

import Container from '../../../Container';

CourseProgressItem.propTypes = {
	item: PropTypes.object
};
export default function CourseProgressItem ({item}) {
	return (
		<Container className="course-progress-item">
			{item.title || item.label}
		</Container>
	);
}
