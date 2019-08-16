import React from 'react';
import PropTypes from 'prop-types';
import {Community} from '@nti/web-profiles';


CourseCommunity.propTypes = {
	course: PropTypes.shape({
		hasCommunity: PropTypes.func,
		getCommunity: PropTypes.func
	})
};
export default function CourseCommunity ({course, ...otherProps}) {
	if (!course.hasCommunity) { return null; }

	return (
		<Community.View community={course.getCommunity()} {...otherProps} />
	);
}