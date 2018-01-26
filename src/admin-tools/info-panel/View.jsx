import {Router, Route} from 'nti-web-routing';

import InfoPanel from './InfoPanel';

export default Router.for([
	Route({
		path: '/',
		component: InfoPanel
	})
]);