import PropTypes from 'prop-types';
import React from 'react';

import './Icon.scss';

LessonOverviewSurveyIcon.propTypes = {
	large: PropTypes.bool,
};

export default function LessonOverviewSurveyIcon ({large, ...otherProps}) {
	return (
		<div {...otherProps} className="lesson-overview-survey-icon" />
	);
}
