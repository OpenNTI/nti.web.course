import {Router, Route} from 'nti-web-routing';// eslint-disable-line

import Completion from './completion';
import Frame from './Frame';

export default Router.for([
	Route({path: '/', component: Completion, name: 'course-admin.completion'})
], {frame: Frame});
