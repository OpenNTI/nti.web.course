import { Models } from '@nti/lib-interfaces';

export const getProgress = course =>
	course instanceof Models.courses.CourseProgress
		? course
		: course?.PreferredAccess?.CourseProgress;
export const getIsCompleted = course =>
	Boolean(getProgress(course)?.getCompletedDate());
export const getPercentageComplete = course =>
	Math.floor((getProgress(course)?.PercentageProgress ?? 0) * 100);
export const getRemainingCount = progress => (
	(progress = getProgress(progress)),
	(progress?.MaxPossibleProgress ?? 0) -
		Math.max(
			0,
			(progress?.AbsoluteProgress ?? 0) -
				(progress?.UnsuccessfulItemNTIIDs?.length ?? 0)
		)
);
export const getRequirementsMet = course =>
	getProgress(course)?.CompletedItem?.Success;
