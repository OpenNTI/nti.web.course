import React from 'react';
import PropTypes from 'prop-types';

import Completion from '../../../admin-tools/advanced/completion';

CourseCompletion.propTypes = {
	instance: PropTypes.object,
};
export default function CourseCompletion({ instance }) {
	return <Completion course={instance} page />;
}
