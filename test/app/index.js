import React from 'react';
import ReactDOM from 'react-dom';
import '@nti/style-common/variables.css';

import FacilitatorsTest from './facilitators';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

ReactDOM.render(
	<FacilitatorsTest />,
	document.getElementById('content')
);
