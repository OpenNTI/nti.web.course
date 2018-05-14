/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {getService} from '@nti/web-client';
import {Layouts} from '@nti/web-commons';
// import {Tasks} from '@nti/lib-commons';

import {Progress, Overview, Info} from '../../src';
import ManageCreditTypesDialog from '../../src/info/inline/components/transcriptcredit/managetypes/Dialog';

import Picker from './PickCourse';

Layouts.Responsive.setWebappContext();

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

// const queue = new Tasks.Executor();

// class Unit extends React.Component {
// 	static propTypes = {
// 		course: PropTypes.object,
// 		layout: PropTypes.any,
// 		node: PropTypes.object,
// 	}

// 	state = {}


// 	render () {
// 		const {
// 			props: {
// 				course,
// 				layout,
// 				node
// 			},
// 			state: {
// 				overview
// 			}
// 		} = this;

// 		return !overview ? null : (
// 			<Overview.Lesson course={course} outlineNode={node}layout={layout}/>
// 		);
// 	}
// }

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
				baseroute: '/',
				route: {
					location: {
						pathname: '/lti'
					}
				},
				getRouteFor: () => {
					return {
						href: '/foo',
						download: true
					};
				},
				history: {
					push: () => {},
					replace: () => {},
					createHref: () => {}
				}
			}
		};
	}

	state = {}

	async componentDidMount () {
		const courseId = 'tag:nextthought.com,2011-10:OU-CourseInfo-9208505778827852429_4744113955624525798';
		const service = await getService();
		const course = await service.getObject(courseId);

		this.setState({
			course
		});
	}

	showProgress = () => {
		const {course} = this.state;
		const link = course.getLink('CourseEnrollmentRoster');
		const overview = Progress.Overview;

		overview.showForBatchLink(`${link}?batchSize=1&batchStart=0`, course);
	}


	render () {
		const {course} = this.state;
		// const limit = localStorage.limit || 1;

		if (!course) { return null; }

		return (
			<ManageCreditTypesDialog/>
		);

		// return (
		// 	<Info catalogEntry={course} editable/>
		// );
	}
}


ReactDOM.render(
	<Picker>
		<Test/>
	</Picker>,
	document.getElementById('content')
);
