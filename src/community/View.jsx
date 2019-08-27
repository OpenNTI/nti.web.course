import React from 'react';
import PropTypes from 'prop-types';
import {Community} from '@nti/web-profiles';

import {Tabs, getTabLabelForCourse} from '../navigation/tabs';


export default class CourseCommunity extends React.Component {
	static propTypes = {
		course: PropTypes.shape({
			hasCommunity: PropTypes.func,
			getCommunity: PropTypes.func
		})
	}

	state = {}

	componentDidMount () {
		this.setup();
	}

	componentDidUpdate (prevProps) {
		const {course} = this.props;
		const {course: prevCourse} = prevProps;

		if (course !== prevCourse) {
			this.setup();
		}
	}

	async setup () {
		const {course} = this.props;

		try {
			const name = await getTabLabelForCourse(course, Tabs.community);

			this.setState({
				tabName: name
			});
		} catch (e) {
			this.setState({
				tabName: ''
			});
		}
	}

	render () {
		const {course, ...otherProps} = this.props;
		const {tabName} = this.state;

		if (!tabName || !course.hasCommunity()) { return null; }

		return (
			<Community.View
				title={tabName}
				community={course.getCommunity()}
				{...otherProps}
			/>
		);
	}
}
