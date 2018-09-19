import {Router, Route} from '@nti/web-routing';// eslint-disable-line

import Completion from './completion';
import Frame from './Frame';
import LTITools from './lti';
import TabNames from './tab-names';

export default Router.for([
	Route({path: 'tab-names', component: TabNames, name: 'course-admin.tab-names'}),
	Route({ path: '/lti', component: LTITools, name: 'course-admin.lti' }),
	Route({ path: '/', component: Completion, name: 'course-admin.completion'}),
], {frame: Frame});
