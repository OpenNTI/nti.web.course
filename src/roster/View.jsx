import {Router, Route} from '@nti/web-routing';

import Progress from './Progress';
import RosterView from './RosterView';
import Dialog from './Dialog';

const noop = () => null;

export default Router.for([
	Route({
		path: '/progress/:encodedBatchLink',
		component: Dialog,
		props: {
			content: Progress,
			modal: true
		}
	}),
	Route({
		path: '/',
		component: noop,
		name: 'course-roster-list'
	}),
], {
	frame: RosterView,
});
