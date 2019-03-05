import React from 'react';
import PropTypes from 'prop-types';
import {getService} from '@nti/web-client';

import {Content} from '../../src';

import PickCourse from './PickCourse';

class PagerTest extends React.Component {
	static propTypes = {
		courseId: PropTypes.string
	}

	state = {
		lesson: 'tag:nextthought.com,2011-10:NTI-NTICourseOutlineNode-Summer2015_NTI_1000.0.1',
		selection: 'tag:nextthought.com,2011-10:NTI-NTIVideo-system_20170807233212_389599_F8ED8140'
		// selection: 'tag:nextthought.com,2011-10:NTIAlpha-NTIVideo-NTI1000_TestCourse.ntivideo.video_Buffalo'
	}

	componentDidMount () {
		this.setup();
	}

	componentDidUpdate (prevProps) {
		const {courseId} = this.props;
		const {courseId:prevCourse} = prevProps;

		if (courseId !== prevCourse) {
			this.setup();
		}
	}


	async setup () {
		const {courseId} = this.props;
		const service = await getService();
		const course = await service.getObject(courseId);

		this.setState({
			course
		});
	}


	render () {
		const {course, lesson, selection} = this.state;

		if (!course) {
			return null;
		}

		return (
			<Content.Pager course={course} lesson={lesson} selection={selection} />
		);
	}
}

export default function ContentPagerTest () {
	return (
		<PickCourse>
			<PagerTest />
		</PickCourse>
	);
}

