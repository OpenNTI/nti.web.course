import React from 'react';
import PropTypes from 'prop-types';
import {getService} from '@nti/web-client';
import {Layouts} from '@nti/web-commons';

// import Overview from '../../src/overview/lesson/Overview';
import {
	Overview,
	// Enrollment,
	// WebinarPanels
} from '../../src';
// import PositionSelect from '../../src/overview/lesson/common/PositionSelect';
// import Button from '../../src/overview/lesson/items/webinar/Button';
// import BaseItem from '../../src/overview/lesson/items/webinar/BaseItem';
import {View as RosterView, Roster} from '../../src/roster';

// import Picker from './PickCourse';

Layouts.Responsive.setWebappContext();

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

	// store enrollment 'tag:nextthought.com,2011-10:NTI-CourseInfo-DefaultAPIImported_NTI_2000_0'
	// ims enrollment   'tag:nextthought.com,2011-10:NTI-CourseInfo-Fall2015_ECON_2843'
	// basic course     'tag:nextthought.com,2011-10:OU-CourseInfo-9208505778827852429_4744113955624525798'

	// async componentDidMount () {
	// 	const courseId = 'tag:nextthought.com,2011-10:OU-CourseInfo-8288534153395311590_4744202394219581819';
	// 	const service = await getService();
	// 	const course = await service.getObject(courseId);
	//
	// 	this.setState({
	// 		course
	// 	});
	// }
	//
	// "tag:nextthought.com,2011-10:cory.jones@nextthought.com-OID-0x399a3f:5573657273:PFDSPJBUzav"

	// async componentDidMount () {
	// 	const service = await getService();
	//
	// 	const courseId = 'tag:nextthought.com,2011-10:cory.jones@nextthought.com-OID-0x2eaf42:5573657273:Ny6JwyrF3en';
	// 	const overview = await service.getObject('tag:nextthought.com,2011-10:OU-NTILessonOverview-8367419836827867652_4744132875403496067_cory_jones_nextthought_com_4744188594575707193_0_cory_jones_nextthought_com_4744188594587791830_0');
	// 	const group = await service.getObject('tag:nextthought.com,2011-10:NTI-NTICourseOverviewGroup-system_20180709205503_623455_3389331819');
	// 	const course = await service.getObject(courseId);
	//
	// 	this.setState({overview, group, course});
	// }

	async componentDidMount () {
		this.now = Date.now();
		const service = await getService();
		// const course = await service.getObject('tag:nextthought.com,2011-10:cory.jones@nextthought.com-OID-0x330b30:5573657273:baC0bEuPGke');
		const course = await service.getObject('tag:nextthought.com,2011-10:ray.hatfield@nextthought.com-OID-0x538f:5573657273:eu8UzG0R2Ad');
		const outline = await course.getOutline();
		const items = outline.getFlattenedList();
		const contentItems = items.filter(item => item.hasLink('overview-content'));
		const outlineNode = contentItems[0];

		const overview = await outlineNode.getContent();

		console.log(overview);

		this.setState({
			course,
			outlineNode,
			overview,
			layout: Overview.Grid
		});
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

	selectGrid = () => {
		this.setState({layout: Overview.Grid});
	}

	selectList = () => {
		this.setState({layout: Overview.List});
	}

	toggleListType = () => {
		const {layout} = this.state;

		this.setState({layout: layout === Overview.Constants.List ? Overview.Constants.Grid : Overview.Constants.List});
	}

	onDelete = () => {
		console.log('hey');
	}

	item = {
		hasCompleted: () => {
			return false;
		},
		webinar: {
			subject: 'This is a webinar webinar webinar webinar webinar webinar webinar webinar webinarwebinarwebinar',
			refresh: () => {
				return Promise.resolve();
			},
			hasLink: (rel) => {
				if(rel === 'JoinWebinar') {
					return true;
				}

				if(rel === 'WebinarRegistrationFields') {
					return false;
				}

				return true;
			},
			getLink: () => {
				return 'test';
			},
			getDuration: () => {
				return 1000 * 10;
			},
			isExpired: () => {
				return Date.now() > this.now + (1000 * 30);
			},
			isJoinable: () => {
				return false;
			},
			isAvailable: () => {
				return Date.now() > this.now + (1000 * 20) && !(Date.now() > this.now + (1000 * 30));
			},
			getNearestSession: () => {
				return {
					getStartTime: () => {
						return new Date(this.now + (1000 * 20));
					},
					getEndTime: () => {
						return new Date(this.now + (1000 * 30));
					}
				};
			}
		}
	}

	renderRoster = props => <Roster {...props} />

	render () {
		if(!this.state.course) {
			return <div>Loading overview...</div>;
		}

		const {course, outlineNode, overview, layout} = this.state;

		return <RosterView course={course} renderRoster={this.renderRoster} />;

		// return (
		// 	<div>
		// 		<div onClick={this.toggleListType}>Toggle</div>
		// 		<Overview.OverviewContents course={course} outlineNode={outlineNode} overview={overview} layout={layout}/>
		// 	</div>
		// );
		//
		// return (
		// 	<div>
		// 		<Overview.Items.Webinar.Editor onDelete={this.onDelete} course={this.state.course} lessonOverview={this.state.overview} overviewGroup={this.state.group}/>
		// 	</div>
		// );

		// return (
		// 	<Info catalogEntry={course} editable/>
		// );
	}
}