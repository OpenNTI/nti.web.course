export const getProgress = course => course?.PreferredAccess?.CourseProgress;
export const getPercentageComplete = course => getProgress(course)?.PercentageProgress;
export const getRemainingCount = course => (getProgress(course)?.MaxPossibleProgress ?? 0) - (getProgress(course)?.AbsoluteProgress ?? 0);
