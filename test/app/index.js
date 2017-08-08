/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';
import { getService } from 'nti-web-client';

import {CoursePanel} from '../../src/components';

import 'nti-style-common/all.scss';
import 'nti-web-commons/lib/index.css';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

class Test extends React.Component {

	state = {}

	componentDidMount () {

	}

	render () {
		//http://janux.dev:8082/dataserver2/++etc++hostsites/platform.ou.edu/++etc++site/Courses/Spring2016/BIOL%202124/CourseCatalogEntry
		//tag:nextthought.com,2011-10:system-OID-0x09a6b9:5573657273:eJy72UE9U37
		// if(!this.state.course) {
		// 	let s = null;
		// 	getService().then((service) => {
		// 		s = service;
		// 		return s.getObject('tag:nextthought.com,2011-10:system-OID-0x09a6b9:5573657273:eJy72UE9U37');
		// 	}).then((course) => {
		// 		s.getObject(course.getLink('CourseCatalogEntry')).then((entry) => {
		// 			this.setState({entry});
		// 		});
		// 	});
		// }

		return (
			<CoursePanel course={this.state.course} title='Create a New Course'/>
		);
	}
}


ReactDOM.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);
