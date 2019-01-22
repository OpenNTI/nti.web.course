import Student from './Student';
import Username from './Username';
import Enrollment from './Enrollment';
import Progress from './Progress';

const columns = [
	Student,
	Username,
	Enrollment,
	Progress
];

export default function columnsFor (course) {
	return columns;
}