/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import {getService} from '@nti/web-client';
import {Layouts} from '@nti/web-commons';
// import {Tasks} from '@nti/lib-commons';

import {Enrollment} from '../../src';

// import Picker from './PickCourse';

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

const OPEN = 'application/vnd.nextthought.courseware.openenrollmentoption';
const FIVE_MINUTE = 'application/vnd.nextthought.courseware.fiveminuteenrollmentoption';
const STORE = 'application/vnd.nextthought.courseware.storeenrollmentoption';
const IMIS = 'application/vnd.nextthought.courseware.ensyncimisexternalenrollmentoption';

const YESTERDAY = (new Date()).setDate((new Date()).getDate() - 1);
const TOMORROW = (new Date()).setDate((new Date()).getDate() + 1);

function buildOption () {
	let mimeType = '';
	let isEnrolled = false;
	let isAvailable = false;
	let description = '';
	let title = '';
	let dropTitle = '';
	let dropDescription = '';
	let dropCutoff = null;
	let enrollCutoff = null;
	let ouPrice = null;
	// let apiDown = false;
	let purchasables = null;
	let enrollmentURL = null;
	let seatAvailable = null;

	let o = {};

	o.type = (m) => {
		mimeType = m;
		return o;
	};

	o.enrolled = (x) => {
		isEnrolled = x;
		return o;
	};

	o.available = (x) => {
		isAvailable = x;
		return o;
	};

	o.title = (x) => {
		title = x;
		return o;
	};

	o.description = (x) => {
		description = x;
		return o;
	};

	o.dropTitle = (x) => {
		dropTitle = x;
		return o;
	};

	o.dropDescription = (x) => {
		dropDescription = x;
		return o;
	};

	o.enrollmentCutoff = (x) => {
		enrollCutoff = x;
		return o;
	};

	o.dropCutoff = (x) => {
		dropCutoff = x;
		return o;
	};

	o.ouPrice = (x) => {
		ouPrice = x;
		return o;
	};

	// o.apiDown = (x) => {
	// 	apiDown = x;
	// 	return o;
	// };

	o.purchasables = (x) => {
		purchasables = x;
		return o;
	};

	o.enrollmentURL = (x) => {
		enrollmentURL = x;
		return o;
	};


	o.seatAvailable = (x) => {
		seatAvailable = x;
		return o;
	};

	o.build = () => {
		return {
			MimeType: mimeType,
			enrolled: isEnrolled,
			available: isAvailable,
			description,
			title,
			'drop_description': dropDescription,
			'drop_title': dropTitle,
			'OU_DropCutOffDate': dropCutoff,
			'OU_EnrollCutOffDate': enrollCutoff,
			'OU_Price': ouPrice,
			'Purchasables': purchasables,
			enrollmentURL,
			fetchLink: (link) => {
				if (link === 'fmaep.course.details') {
					if (seatAvailable) {
						return {Course: {SeatAvailable: seatAvailable}};
					}

					throw new Error('Api Down');
				}
			},
			getPurchasable () {
				return purchasables && purchasables.Items[0];
			},
			getPurchasableForGifting () {
				const item = purchasables && purchasables.Items[0];

				return item && item.Giftable && item;
			},
			getPurchasableForRedeeming () {
				const item = purchasables && purchasables.Items[0];

				return item && item.Redeemable && item;
			}
		};
	};

	return o;
}

function buildPurchasable () {
	let price = null;
	let giftable = false;
	let redeemable = false;

	let p = {};

	p.price = (x) => {
		price = x;
		return p;
	};

	p.giftable = (x) => {
		giftable = x;
		return p;
	};

	p.redeemable = (x) => {
		redeemable = x;
		return p;
	};

	p.build = () => {
		const id = 'fakegiftid';

		return {
			DefaultGiftingNTIID: id,
			DefaultPurchaseNTIID: id,
			Items: [
				{
					Giftable: giftable,
					Redeemable: redeemable,
					amount: price
				}
			]
		};
	};

	return p;
}

function buildCourse () {
	let enrolled = false;
	let admin = false;
	let startDate = null;
	let endDate = null;
	let options = [];

	let c = {};

	c.addOption = (x) => {
		options.push(x);
		return c;
	};

	c.enrolled = (x) => {
		enrolled = x;
		return c;
	};

	c.admin = (x) => {
		admin = x;
		return c;
	};


	c.startDate = (x) => {
		startDate = x;
		return c;
	};

	c.endDate = (x) => {
		endDate = x;
		return c;
	};

	c.build = () => {
		return {
			getEnrollmentOptions () {
				return options;
			},

			async fetchLinkParsed (rel) {
				if (rel === 'UserCoursePreferredAccess') {
					if (!enrolled && !admin) {
						throw new Error('Not Enrolled');
					} else {
						return {
							isAdministrative: admin,
							getCreatedTime () {
								return YESTERDAY;
							}
						};
					}
				}
			},


			getStartDate () {
				return startDate;
			},


			getEndDate () {
				return endDate;
			}
		};
	};

	return c;
}

const course = buildCourse()
	.enrolled(false)
	.startDate(TOMORROW)
	// .endDate(YESTERDAY)
	.addOption(
		buildOption()
			.type(OPEN)
			.available(true)
			.enrolled(false)
			.build()
	)
	.addOption(
		buildOption()
			.type(FIVE_MINUTE)
			.available(false)
			.ouPrice(200)
			.seatAvailable(10)
			.build()
	)
	.addOption(
		buildOption()
			.type(STORE)
			.available(true)
			.purchasables(
				buildPurchasable()
					.price(100)
					.giftable(true)
					.redeemable(true)
					.build()
			)
			.build()
	)
	.addOption(
		buildOption()
			.type(IMIS)
			.available(false)
			.enrollmentURL('http://www.google.com')
			.build()
	)
	.build();



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


	render () {
		//const {course} = this.state;
		// const limit = localStorage.limit || 1;

		if (!course) { return null; }

		return (
			<Enrollment.Options catalogEntry={course} />
		);

		// return (
		// 	<Info catalogEntry={course} editable/>
		// );
	}
}


ReactDOM.render(
	<Test/>,
	document.getElementById('content')
);
