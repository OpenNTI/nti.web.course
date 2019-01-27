import React from 'react';
import {getService} from '@nti/web-client';

import {View as RosterView, Roster} from '../../src/roster';

export default class RosterTest extends React.Component {

	state = {}

	async componentDidMount () {
		const service = await getService();
		const course = await service.getObject('tag:nextthought.com,2011-10:ray.hatfield@nextthought.com-OID-0x538f:5573657273:eu8UzG0R2Ad');

		this.setState({
			course
		});
	}

	renderRoster = props => <Roster {...props} />

	render () {
		const {course} = this.state;

		if(!course) {
			return <div>Loading...</div>;
		}

		return (
			<RosterView course={course} renderRoster={this.renderRoster} />
		);
	}
}
