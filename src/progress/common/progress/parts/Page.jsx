import React from 'react';
import PropTypes from 'prop-types';

import Loading from './Loading';
import Overview from './Overview';

CourseProgressPage.propTypes = {
	loading: PropTypes.bool,
	page: PropTypes.object,
	error: PropTypes.object,
	pageHeight: PropTypes.number
};
export default function CourseProgressPage ({loading, page, error, pageHeight}) {
	return (
		<div>
			{loading && (<Loading pageHeight={pageHeight} />)}
			{page && (<Overview overview={page.Items[0]} />)}
		</div>
	);
}
