import React from 'react';
import {getService} from '@nti/web-client';
import {Router, Route} from '@nti/web-routing';
import {encodeForURI} from '@nti/lib-ntiids';

import {default as RosterView} from '../../src/roster';

const Routes = Router.for([
	Route({
		path: '/',
		component: RosterView,
		name: 'course-roster',
		getRouteFor: (obj, context) => {
			if ((obj || {}).getID) {
				return `/path/to/object/${encodeForURI(obj.getID())}`;
			}
		}
	}),
]);

export default class RosterTest extends React.Component {

	state = {}

	async componentDidMount () {
		const service = await getService();
		// const course = await service.getObject('tag:nextthought.com,2011-10:ray.hatfield@nextthought.com-OID-0x538f:5573657273:eu8UzG0R2Ad');
		const course = await service.getObject('tag:nextthought.com,2011-10:ray.hatfield@nextthought.com-OID-0x13086e:5573657273:kE0RxGafqhJ');

		this.setState({
			course
		});
	}

	render () {
		const {course} = this.state;

		if(!course) {
			return <div>Loading...</div>;
		}

		return (
			<Routes course={course} />
		);
	}
}
