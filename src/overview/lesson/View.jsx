import {Router, Route} from 'nti-web-routing';// eslint-disable-line

import OutlineNode from './OutlineNode';

export default Router.for([
	Route({path: '/', component: OutlineNode})
]);
