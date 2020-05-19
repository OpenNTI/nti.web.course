import {Router, Route} from '@nti/web-routing';

import Frame from './Frame';
import {RouteNames} from './Constants';
import About from './routes/About';
import Reports from './routes/Reports';
import Roster from './routes/Roster';

export default Router.for([
	Route({path: '/reports', component: Reports, name: RouteNames.Reports}),
	Route({path: '/roster', component: Roster, name: RouteNames.Roster}),
	Route({path: '/', exact:  true, component: About, name: RouteNames.About})
], {frame: Frame});