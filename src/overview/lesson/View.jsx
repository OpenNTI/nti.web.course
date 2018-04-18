import {Router, Route} from '@nti/web-routing';

import OutlineNode from './OutlineNode';

export default Router.for([
	Route({path: '/', component: OutlineNode})
]);
