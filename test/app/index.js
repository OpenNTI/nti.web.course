/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';
import {getService} from 'nti-web-client';
import {Input} from 'nti-web-search';

import {Roster} from '../../src';

import 'nti-style-common/all.scss';
import 'nti-web-commons/lib/index.css';
import 'nti-web-video/lib/index.css';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

class Test extends React.Component {
	state = {}

	async componentDidMount () {
		const service = await getService();
		const course = await service.getObject('tag:nextthought.com,2011-10:system-OID-0x53ec:5573657273:krsMx9Uw2d7');

		this.setState({
			course
		});
	}

	render () {
		const {course} = this.state;

		if (!course) { return null; }

		return (
			<div>
				<Input />
				<Roster
					course={course}
					renderRoster={this.renderRoster}
				/>
			</div>

		);
	}


	renderRoster = ({items, error, loading, loadNextPage, loadPrevPage}) => {
		if (loading) {
			return (<span>Loading</span>);
		}

		if (error) {
			return (<span>Error</span>);
		}

		if (!items || !items.length) {
			return (<span>Empty</span>);
		}

		return (
			<div>
				<ul>
					{items.map((item, index) => {
						return (
							<li key={index}>
								{item.Username}
							</li>
						);
					})}
				</ul>
				{loadPrevPage && (<span onClick={loadPrevPage}>Prev</span>)}
				{loadNextPage && (<span onClick={loadNextPage}>Next</span>)}
			</div>
		);
	}
}


ReactDOM.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);
