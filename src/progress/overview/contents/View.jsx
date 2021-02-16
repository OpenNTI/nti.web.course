import React from 'react';
import PropTypes from 'prop-types';

import { Items } from '../../remaining-items';

ProgressOverviewContents.propTypes = {
	course: PropTypes.object,
	enrollment: PropTypes.object,
};
export default function ProgressOverviewContents({ course, enrollment }) {
	return <Items course={course} enrollment={enrollment} readOnly />;
}
