import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import {Grid, List} from '../../Constants';
import Registry from '../Registry';

import ListCmp from './List';
import GridCmp from './Grid';

const DEFAULT_TEXT = {
	commentLabel: {
		topics: {
			one: '%(count)s Discussion',
			other: '%(count)s Discussions'
		},
		comments: {
			one: '%(count)s Comment',
			other: '%(count)s Comments'
		}
	}
};
const t = scoped('course.overview.lesson.items.discussion.View', DEFAULT_TEXT);


const HANDLES = [
	'application/vnd.nextthought.discussionref',
	'application/vnd.nextthought.discussion'
];

export default
@Registry.register(HANDLES)
class LessonOverviewDiscussion extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		course: PropTypes.object,
		layout: PropTypes.oneOf([Grid, List])
	}

	state = {}


	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (prevProps) {
		const {item:nextItem, course:nextCourse} = this.props;
		const {item:oldItem, course:oldCourse} = prevProps;

		if (nextItem !== oldItem || nextCourse !== oldCourse) {
			this.setupFor(this.props);
		}
	}


	componentWillUnmount () {
		this.unmounted = this;
		this.setState = () => {};
	}


	setupFor (props = this.props) {
		const {item, course} = this.props;

		this.setupTopic(item, course);
		this.setupIcon(item, course);
	}


	async setupTopic (item, course) {
		try {
			const topic = await item.resolveTarget(course);
			const isForum = topic.hasOwnProperty('TopicCount');

			this.setState({
				topic,
				title: topic.title,
				commentLabel: isForum ?
					t('commentLabel.topics', {count: topic.TopicCount || 0}) :
					t('commentLabel.comments', {count: topic.PostCount || 0})
			});
		} catch (e) {
			this.setState({
				disabled: true,
				title: item.title
			});
		}
	}


	async setupIcon (item, course) {
		if (!item.icon) { return; }

		try {
			const icon = await course.resolveContentURL(item.icon);

			this.setState({
				icon
			});
		} catch (e) {
			//No need to do anything here
		}
	}


	render () {
		const {layout, ...otherProps} = this.props;

		const Cmp = layout === List ? ListCmp : GridCmp;

		return (
			<Cmp layout={layout} {...otherProps} {...this.state} />
		);
	}
}
