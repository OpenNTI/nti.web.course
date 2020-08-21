import './AssignmentTitle.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

const DEFAULT_TEXT = {
	assignmentTitle: {
		title: '%(title)s',
		points: '%(points)spts.'
	}
};
const t = scoped('course.overview.lesson.overview.question-set.AssignmentTitle', DEFAULT_TEXT);


LessonOverviewAssignmentTitle.propTypes = {
	assignment: PropTypes.object
};
export default function LessonOverviewAssignmentTitle ({assignment}) {
	const {title} = assignment;

	return (
		<span className="lesson-overview-assignment-title">
			<span className="title">{t('assignmentTitle.title', {title})}</span>
		</span>
	);
}
