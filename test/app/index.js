/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {getService} from 'nti-web-client';
import {Layouts} from 'nti-web-commons';

import Overview from '../../src/overview/lesson/Overview';

import Picker from './PickCourse';

import 'nti-style-common/all.scss';
import 'nti-web-commons/lib/index.css';
import 'nti-web-video/lib/index.css';
import 'nti-web-whiteboard/lib/index.css';

Layouts.Responsive.setWebappContext();

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

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
		const contentItems = items.filter(item => item.hasLink('overview-content'));
		const outlineNode = contentItems[0];
		const overview = await outlineNode.getContent({decorateProgress: false});

		this.setState({
			course,
			outlineNode,
			overview
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
		const {course, outlineNode, overview, layout} = this.state;

		if (!course) { return null; }

		return (
			<div>
				<label><input type="radio" checked={layout === Overview.Grid} onChange={this.selectGrid}/>Grid</label>
				<label><input type="radio" checked={layout === Overview.List} onChange={this.selectList}/>List</label>
				<Overview course={course} outlineNode={outlineNode} overview={overview} layout={layout}/>
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
