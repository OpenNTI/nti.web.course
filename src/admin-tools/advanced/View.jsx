import {Router, Route} from '@nti/web-routing';// eslint-disable-line

import Completion from './completion';
import Frame from './Frame';
import LTITools from './lti';

export default Router.for([
	Route({ path: '/lti', component: LTITools, name: 'course-admin.lti' }),
	Route({ path: '/', component: Completion, name: 'course-admin.completion'})
], {frame: Frame});
