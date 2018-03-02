/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';
import {getService} from 'nti-web-client';

import {PackageWizard} from '../../src/scorm/package-wizard';

import 'nti-style-common/all.scss';
import 'nti-web-commons/lib/index.css';
import 'nti-web-video/lib/index.css';
import 'nti-web-whiteboard/lib/index.css';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

class Test extends React.Component {
	state = {}

	render () {
		return (
			<div>
				<h2>HELLO</h2>
				<PackageWizard />
			</div>

		);
	}
}


ReactDOM.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);
