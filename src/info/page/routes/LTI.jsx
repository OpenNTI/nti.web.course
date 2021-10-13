import PropTypes from 'prop-types';

import LTI from '../../../admin-tools/advanced/lti';

CourseLTI.propTypes = {
	instance: PropTypes.object,
};
export default function CourseLTI({ instance }) {
	return <LTI course={instance} page />;
}
