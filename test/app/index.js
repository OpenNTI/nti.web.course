/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {getService} from 'nti-web-client';
import {Layouts} from 'nti-web-commons';
import {Tasks} from 'nti-commons';

import Overview from '../../src/overview/lesson/Overview';

import Picker from './PickCourse';

import 'nti-style-common/all.scss';
import 'nti-web-commons/lib/index.css';
import 'nti-web-video/lib/index.css';
import 'nti-web-whiteboard/lib/index.css';

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
			<Overview course={course} outlineNode={node} overview={overview} layout={layout}/>
		);
	}
}

class Test extends React.Component {
	static propTypes = {
		courseId: PropTypes.string
	}

	state = {
		layout: Overview.Grid
	}

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


	selectGrid = () => {
		this.setState({
			layout: Overview.Grid
		});
	}


	selectList = () => {
		this.setState({
			layout: Overview.List
		});
	}


	render () {
		const {course, nodes, layout} = this.state;
		const limit = localStorage.limit || 1;

		if (!course) { return null; }

		return (
			<div>
				<label><input type="radio" checked={layout === Overview.Grid} onChange={this.selectGrid}/>Grid</label>
				<label><input type="radio" checked={layout === Overview.List} onChange={this.selectList}/>List</label>

				{nodes.slice(0, limit).map(node => (
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
