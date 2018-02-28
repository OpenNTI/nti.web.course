/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';
import {getService} from 'nti-web-client';

import Overview from '../../src/overview/lesson/Overview';

import 'nti-style-common/all.scss';
import 'nti-web-commons/lib/index.css';
import 'nti-web-video/lib/index.css';
import 'nti-web-whiteboard/lib/index.css';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

class Test extends React.Component {
	state = {
		layout: Overview.Grid
	}

	async componentDidMount () {
		const service = await getService();
		const course = await service.getObject('tag:nextthought.com,2011-10:system-OID-0x1072c0:5573657273:ZGxhE9p5JbW');
		const outline = await course.getOutline();
		const items = outline.getFlattenedList();
		const contentItems = items.filter(item => item.hasLink('overview-content'));
		const outlineNode = contentItems[0];
		const overview = await outlineNode.getContentRaw();

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
	React.createElement(Test, {}),
	document.getElementById('content')
);
