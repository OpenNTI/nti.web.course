import React from 'react';
import PropTypes from 'prop-types';

ProgressPageLoading.propTypes = {
	pageHeight: PropTypes.number
};
export default function ProgressPageLoading ({pageHeight}) {
	const total = Math.floor(pageHeight / 70);
	const placeholders = Array.from({length: total});

	return (
		<div className="course-progress-progress-loading">
			{placeholders.map((_, index) => {
				return (<div className="placeholder" key={index} />);
			})}
		</div>
	);
}
