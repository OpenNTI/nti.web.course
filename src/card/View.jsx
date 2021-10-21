import PropTypes from 'prop-types';

import { getComponent } from './types';
import Placeholder from './parts/Placeholder';

CourseCard.Placeholder = Placeholder;
CourseCard.propTypes = {
	course: PropTypes.object,
};
export default function CourseCard({ course, ...otherProps }) {
	const Cmp = getComponent(course && course.MimeType);

	if (!Cmp) {
		throw new Error('Unknown Course Type');
	}

	return <Cmp course={course} {...otherProps} />;
}
