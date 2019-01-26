import Student from './Student';
import Username from './Username';
import Enrollment from './Enrollment';
import Progress from './Progress';
import ParticipationReport from './ParticipationReport';

const columns = [
	{ component: Student },
	{ component: Username },
	{ component: Enrollment },
	{ component: Progress },
	{
		component: ParticipationReport,
		// predicate: course => !!(course || {}).CompletionPolicy
	},
];

export default function columnsFor (course) {
	return columns
		.filter(({predicate}) => !predicate || predicate(course))
		.map(({component}) => component)
		.filter(Boolean);
}
