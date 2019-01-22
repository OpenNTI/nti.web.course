import Student from './Student';
import Username from './Username';
import Enrollment from './Enrollment';
import Progress from './Progress';
import ParticipationReport from './ParticipationReport';

const columns = [
	Student,
	Username,
	Enrollment,
	Progress,
	ParticipationReport,
];

export default function columnsFor (course) {
	return columns;
}