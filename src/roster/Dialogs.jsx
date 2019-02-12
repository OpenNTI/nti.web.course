import {Router, Route} from '@nti/web-routing';
import {Prompt} from '@nti/web-commons';

import Progress from './Progress';

export default Router.for([
	Route({
		path: '/progress/:encodedBatchLink',
		component: Progress,
		props: {
			modal: true,
		}
	})
], {
	frame: Prompt.Dialog,
});
