import {Router, Route} from '@nti/web-routing';

import HeaderCmp from './header';

export const Header = Router.for([
	Route({path: '*', component: HeaderCmp})
]);
