import React from 'react';
import PropTypes from 'prop-types';
import {Avatar, DisplayName} from '@nti/web-commons';
import {CircularProgress} from '@nti/web-charts';
import { scoped } from '@nti/lib-locale';

const t = scoped('course.progress.overview.scorm-contents', {
	passed: 'Passed',
	failed: 'Failed',
	completed: 'Complete',
	incomplete: 'Incomplete'
});

ProgressOverviewStatsEnrollment.propTypes = {
	enrollment: PropTypes.object,
	course: PropTypes.object
};

export const getScormStatus = (enrollment) => {
	const { CourseProgress } = enrollment || {};
	const { Completed, CompletedItem } = CourseProgress || {};

	if (Completed == null || CourseProgress == null) {
		return '';
	}

	if (Completed && CompletedItem && CompletedItem.Success) {
		return 'passed';
	} else if (Completed && CompletedItem && CompletedItem.Success === false) {
		return 'failed';
	} else if (Completed && CompletedItem && CompletedItem.Success === null) {
		return 'completed';
	} else {
		return 'incomplete';
	}
};

export default function ProgressOverviewStatsEnrollment ({enrollment, course}) {
	const {UserProfile, CourseProgress} = enrollment;
	const progress = Math.floor((CourseProgress.PercentageProgress || 0) * 100);
	const { isScormInstance } = course;
	const scormStatus = isScormInstance && getScormStatus(enrollment);

	return (
		<div className="progress-overview-stats-enrollment-progress">
			<div className="enrollment-info">
				<div className="icon">
					<div className="avatar-container">
						<Avatar entity={UserProfile} />
						<CircularProgress value={progress} width={35} height={35} />
					</div>
				</div>
				<DisplayName entity={UserProfile} />
				{isScormInstance && (
					<div className={`scorm-completion-status ${scormStatus}`}>
						{t(scormStatus)}
					</div>
				)}
			</div>
		</div>
	);
}
