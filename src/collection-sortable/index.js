import { scoped } from '@nti/lib-locale';

export { Page } from './Page';
export { Grid } from './components/Grid';
export { CourseCollectionGroup as Group } from './components/Group';
export { Store } from './Store';

export const getSortOptionText = scoped('course.sorting', {
	availability: 'By Availability',
	favorites: 'Default (Current and Upcoming)',
	createdTime: 'By Date Added',
	provideruniqueid: 'By ID',
	lastSeenTime: 'By Last Opened',
	title: 'By Title',
});
