import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	assignmentTitle: {
		title: '%(title)s',
		points: '%(points)spts.'
	}
};
const t = scoped('nti-web-course.overview.lesson.overview.question-set', DEFAULT_TEXT);

export function getAssignmentTitle (assignment) {
	return t('assignmentTitle.title', {title: assignment.title});
}

export function getAssignmentPoints (assignment) {
	const {totalPoints:points} = assignment;

	return isNaN(points) || points < 1 ? '' : t('assignmentTitle.points', {points});
}
