/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';

// import RosterTest from './RosterTest';
import ContentPager from './content-pager';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

ReactDOM.render(
	<ContentPager />,
	document.getElementById('content')
);
