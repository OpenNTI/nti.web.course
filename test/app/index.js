/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';

class Test extends React.Component {

	state = {}

	componentDidMount () {

	}

	render () {
		return (
			<div>Course widgets go here</div>
		);
	}
}


ReactDOM.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);
