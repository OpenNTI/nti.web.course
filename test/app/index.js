/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';

import RosterTest from './RosterTest';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

ReactDOM.render(
	<RosterTest />,
	document.getElementById('content')
);
