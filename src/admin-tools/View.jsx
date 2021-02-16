import { Router, Route } from '@nti/web-routing';

import Dashboard from './dashboard';
import Reports from './reports';
import Advanced from './advanced';
import Frame from './Frame';

export default Router.for(
	[
		Route({ path: '/dashboard', component: Dashboard }),
		Route({ path: '/reports', component: Reports }),
		Route({ path: '/advanced', component: Advanced }),
		Route({ path: '/', component: Dashboard }),
	],
	{ title: 'Course Administration', frame: Frame }
);
