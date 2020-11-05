import React from 'react';
import PropTypes from 'prop-types';

import Roster from '../../../roster';

CourseRoster.propTypes = {
	instance: PropTypes.object
};
export default function CourseRoster ({instance, ...otherProps}) {
	return (
		<Roster course={instance} inline {...otherProps} />
	);
}
