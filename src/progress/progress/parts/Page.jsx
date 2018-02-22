import React from 'react';
import PropTypes from 'prop-types';

import Items from './items';
import Loading from './Loading';

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
			{page && (<Items items={page.Items} />)}
		</div>
	);
}
