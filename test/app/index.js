/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {getService} from 'nti-web-client';
import {Layouts} from 'nti-web-commons';
import {Tasks} from 'nti-commons';
import {getHistory} from 'nti-web-routing';

import {Overview} from '../../src';

import Picker from './PickCourse';

Layouts.Responsive.setWebappContext();

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

const queue = new Tasks.Executor();

class Unit extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		layout: PropTypes.any,
		node: PropTypes.object,
	}

	state = {}

	async componentDidMount () {
		const {node} = this.props;
		const overview = await queue.queueTask(() => node.getContent());

		this.setState({
			overview
		});
	}

	render () {
		const {
			props: {
				course,
				layout,
				node
			},
			state: {
				overview
			}
		} = this;

		return !overview ? null : (
			<Overview.Lesson course={course} outlineNode={node} overview={overview} layout={layout}/>
		);
	}
}

class Test extends React.Component {
	static propTypes = {
		courseId: PropTypes.string
	}

	static childContextTypes = {
		router: PropTypes.object
	}

	getChildContext () {
		return {
			router: {
				history: getHistory(),
				baseroute: '/',
				getRouteFor: () => {
					debugger;
				}
			}
		};
	}

	state = {}

	async componentDidMount () {
		const {courseId} = this.props;
		const service = await getService();
		const course = await service.getObject(courseId);
		const outline = await course.getOutline();
		const items = outline.getFlattenedList();
		const nodes = items.filter(item => item.hasLink('overview-content'));

		this.setState({
			course,
			nodes
		});
	}



	render () {
		const {course, nodes, layout} = this.state;
		// const limit = localStorage.limit || 1;

		if (!course) { return null; }

		return (
			<div>
				{nodes.slice(16, 17).map(node => (
					<Unit key={node.NTIID} course={course} node={node} layout={layout}/>
				))}
			</div>

		);
	}
}


ReactDOM.render(
	<Picker>
		<Test/>
	</Picker>,
	document.getElementById('content')
);
