/*eslint no-console: 0*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

class Test extends React.Component {

	state = {}

	componentDidMount () {
		
	}

	render () {
		const {content, course} = this.state;

		return (
			<div/>
		);
	}
}


ReactDOM.render(
	<Test/>,
	document.getElementById('content')
);
