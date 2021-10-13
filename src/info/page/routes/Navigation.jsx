import PropTypes from 'prop-types';

import { TabsEditor } from '../../../navigation';

CourseNavigation.propTypes = {
	instance: PropTypes.object,
};
export default function CourseNavigation({ instance }) {
	return <TabsEditor course={instance} page />;
}
