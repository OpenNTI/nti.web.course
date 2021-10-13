import PropTypes from 'prop-types';

import Items from './items';
import Loading from './Loading';

CourseProgressPage.propTypes = {
	loading: PropTypes.bool,
	page: PropTypes.object,
	error: PropTypes.object,
	pageHeight: PropTypes.number,
	course: PropTypes.object,
};
export default function CourseProgressPage({
	loading,
	page,
	error,
	pageHeight,
	course,
}) {
	return (
		<div>
			{loading && <Loading pageHeight={pageHeight} />}
			{page && <Items items={page.Items} course={course} />}
		</div>
	);
}
