import {Router, Route} from '@nti/web-routing';

import Frame from './Frame';
import {RouteNames} from './Constants';
import About from './routes/About';
import Completion from './routes/Completion';
import LTI from './routes/LTI';
import Reports from './routes/Reports';
import Roster from './routes/Roster';

export default Router.for([
	Route({path: '/lti-tools', component: LTI, name: RouteNames.LTI}),
	Route({path: '/completion', component: Completion, name: RouteNames.Completion}),
	Route({path: '/reports', component: Reports, name: RouteNames.Reports}),
	Route({path: '/roster', component: Roster, name: RouteNames.Roster}),
	Route({path: '/', exact:  true, component: About, name: RouteNames.About})
], {frame: Frame});