import {scoped} from '@nti/lib-locale';

const t = scoped('course.utils.Semester.months', {
	0: 'January',
	1: 'February',
	2: 'March',
	3: 'April',
	4: 'May',
	5: 'June',
	6: 'July',
	7: 'August',
	8: 'September',
	9: 'October',
	10: 'November',
	11: 'December'
});

export function getEffectiveDate (course) {
	// if there is no start date, but we have an end date, consider that end date
	// as the 'effective' date for the course.  So when determining which semester an archived
	// course occurred, basing it on the EndDate is our only option without a StartDate
	return course.getStartDate() || course.getEndDate();
}

export function getSemester (course) {
	let start = getEffectiveDate(course),
		month = start && start.getMonth(),
		s = start && t(month.toString());
	return s || '';
}

export function  getSemesterBadge (course) {
	let start = getEffectiveDate(course),
		year = start && start.getFullYear(),
		semester = getSemester(course);

	if (!start) {
		return '';
	}

	return semester + ' ' + year;
}
