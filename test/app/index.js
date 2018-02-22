/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';
import {getService} from 'nti-web-client';

import {Progress} from '../../src';

import 'nti-style-common/all.scss';
import 'nti-web-commons/lib/index.css';
import 'nti-web-video/lib/index.css';
import 'nti-web-whiteboard/lib/index.css';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

class Test extends React.Component {
	state = {}

	async componentDidMount () {
		const service = await getService();
		const course = await service.getObject('tag:nextthought.com,2011-10:system-OID-0x1072c0:5573657273:ZGxhE9p5JbW');

		this.setState({
			course
		});
	}

	render () {
		return (
			<div>
				<Progress course={course} />
			</div>

		);
	}
}


ReactDOM.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);
