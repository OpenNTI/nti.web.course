import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

LessonOverviewSurveyIcon.propTypes = {
	large: PropTypes.bool
};
export default function LessonOverviewSurveyIcon ({large, ...otherProps}) {
	return (
		<div className={cx('lesson-overview-survey-icon', {large})} {...otherProps} />
	);
}
