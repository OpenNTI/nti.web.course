/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';

import { CourseListing, CourseCreateButton } from '../../src/components';

import 'nti-style-common/all.scss';
import 'nti-web-commons/lib/index.css';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

class Test extends React.Component {
	componentDidMount () {

	}

	render () {
		return (<div>
			<CourseCreateButton/>
			<CourseListing isAdministrative/>
		</div>);
	}
}


ReactDOM.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);
