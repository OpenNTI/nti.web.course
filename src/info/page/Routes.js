import {Router, Route} from '@nti/web-routing';

import Frame from './Frame';
import {RouteNames} from './Constants';
import About from './routes/About';

export default Router.for([
	Route({path: '/', component: About, name: RouteNames.About})
], {frame: Frame});