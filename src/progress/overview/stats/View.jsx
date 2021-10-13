import './View.scss';
import PropTypes from 'prop-types';

import EnrollmentProgress from './EnrollmentProgress';
import Charts from './charts';

ProgressOverviewStats.propTypes = {
	course: PropTypes.object.isRequired,
	enrollment: PropTypes.object,
	singleItem: PropTypes.bool,
};
export default function ProgressOverviewStats({
	course,
	enrollment,
	singleItem,
}) {
	const showEnrollment = enrollment && !singleItem;

	return (
		<div className="progress-overview-stats">
			{showEnrollment && (
				<EnrollmentProgress course={course} enrollment={enrollment} />
			)}
			<Charts
				course={course}
				enrollment={enrollment}
				large={!showEnrollment}
			/>
		</div>
	);
}
