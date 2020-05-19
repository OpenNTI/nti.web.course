import React from 'react';
import PropTypes from 'prop-types';

import Roster from '../../../roster';

CourseRoster.propTypes = {
	instance: PropTypes.object
};
export default function CourseRoster ({instance}) {
	return (
		<Roster course={instance} inline />
	);
}