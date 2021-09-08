/** @typedef {import('@nti/lib-interfaces').Models.courses.Instance} Instance */

import { scoped } from '@nti/lib-locale';

const t = scoped('course.utils.Semester.months', {
	0: 'January %(year)s',
	1: 'February %(year)s',
	2: 'March %(year)s',
	3: 'April %(year)s',
	4: 'May %(year)s',
	5: 'June %(year)s',
	6: 'July %(year)s',
	7: 'August %(year)s',
	8: 'September %(year)s',
	9: 'October %(year)s',
	10: 'November %(year)s',
	11: 'December %(year)s',
	'not-set': '',
});

/**
 *
 * @param {Instance} course - The course instance
 * @returns {?Date} - Date
 */
export function getEffectiveDate(course) {
	// if there is no start date, but we have an end date, consider that end date
	// as the 'effective' date for the course.  So when determining which semester an archived
	// course occurred, basing it on the EndDate is our only option without a StartDate
	return course.getStartDate() || course.getEndDate();
}

/**
 *
 * @param {Instance} course - The course instance
 * @returns {string} formatted string
 */
export function getSemester(course) {
	let start = getEffectiveDate(course),
		month = start && start.getMonth(),
		s =
			start &&
			t(month.toString(), { year: start.getFullYear().toString() });
	return s || '';
}

/**
 *
 * @param {Instance} course - The course instance
 * @returns {string} formatted string
 */
export function getSemesterBadge(course) {
	let start = getEffectiveDate(course),
		semester = getSemester(course);

	if (!start) {
		return '';
	}

	return semester;
}
