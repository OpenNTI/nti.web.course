/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {getService} from '@nti/web-client';
import {Layouts, Navigation} from '@nti/web-commons';
import {Router, Route, LinkTo} from '@nti/web-routing';
// import {Tasks} from '@nti/lib-commons';

// import Overview from '../../src/overview/lesson/Overview';
import {Navigation as CourseNavigation} from '../../src';
// import PositionSelect from '../../src/overview/lesson/common/PositionSelect';
// import Button from '../../src/overview/lesson/items/webinar/Button';
// import BaseItem from '../../src/overview/lesson/items/webinar/BaseItem';

// import Picker from './PickCourse';

Layouts.Responsive.setWebappContext();

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

function Home () {
	return (
		<div>
			<LinkTo.Path to="./course-ntiid">
				Open Course
			</LinkTo.Path>
		</div>
	);
}

function Activity () { return (<div>Activity</div>); }
function Lesson () {
	return (
		<div>
			<div>Lesson</div>
			<div>
				<LinkTo.Path to="./lessons/lesson1">Go to Lesson 1</LinkTo.Path>
			</div>
			<div>
				<LinkTo.Path to="./assignments">Go to Assignments</LinkTo.Path>
			</div>
		</div>
	);
}
function Assignments () {
	return (
		<div>
			<div>Assignments</div>
			<div>
				<LinkTo.Path to="./assignments/assignment1">Go to Assignment 1</LinkTo.Path>
			</div>
			<div>
				<LinkTo.Path to="./lessons">Goto Lessons</LinkTo.Path>
			</div>
		</div>
	);
}
function Discussions () { return (<div>Discussions</div>); }
function CourseInfo () { return (<div>CourseInfo</div>); }

class CourseFrame extends React.Component {
	static propTypes = {
		courseID:  PropTypes.string,
		children: PropTypes.any
	}


	state = {}


	async componentDidMount () {
		const service = await getService();
		const course = await service.getObject('tag:nextthought.com,2011-10:system-OID-0x53ec:5573657273:krsMx9Uw2d7');

		this.setState({
			course
		});
	}


	renderTab = (tabCmp, tab) => {
		return (
			<LinkTo.Path to={tab.route}>
				{tabCmp}
			</LinkTo.Path>
		);
	}


	render () {
		const {course} = this.state;

		if (!course) {
			return (
				<div>Loading...</div>
			);
		}

		const {children} = this.props;

		return (
			<div>
				<div><Navigation renderTab={this.renderTab}/></div>
				<div><CourseNavigation.Tabs course={course} exclude={['activity']}/></div>
				<div>{children}</div>
			</div>
		);
	}
}


const courseRouter = Router.for([
	Route({
		path: './activity',
		component: Activity,
		getRouteFor: (obj, context) => {
			if (obj.isCourse && context === 'activity') {
				return './activity';
			}
		}
	}),
	Route({
		path: './lessons',
		component: Lesson,
		getRouteFor: (obj, context) => {
			if (obj.isCourse && context === 'lessons') {
				return './lessons';
			}
		}
	}),
	Route({
		path: './assignments',
		component: Assignments,
		getRouteFor: (obj, context) => {
			if (obj.isCourse && context === 'assignments') {
				return './assignments';
			}
		}
	}),
	Route({
		path: './discussions',
		component: Discussions,
		getRouteFor: (obj, context) => {
			if (obj.isCourse && context === 'discussions') {
				return './discussions';
			}
		}
	}),
	Route({
		path: './info',
		component: CourseInfo,
		getRouteFor: (obj, context) => {
			if (obj.isCourse && context === 'info') {
				return './info';
			}
		}
	})
], {frame: CourseFrame});

const Test = Router.for([
	Route({path: '/course-ntiid', component: courseRouter}),
	Route({path: '/', component: Home})
]);

ReactDOM.render(
	<Test/>,
	document.getElementById('content')
);
