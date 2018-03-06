import React from 'react';
import PropTypes from 'prop-types';
import {getService} from 'nti-web-client';
import {parseNTIID} from 'nti-lib-ntiids';
import {scoped} from 'nti-lib-locale';

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

const SPECIAL_ID_REGEX = /^Topic:EnrolledCourse(Section|Root)$/;

function maybeFixNTIID (ntiid, course) {
	const parts = parseNTIID(ntiid);
	const catalogEntry = course && course.CatalogEntry;

	/*
	 * Here is a hack.  The crux of which is to supply context about the subinstance we are in
	 * when we resolving a topic. We do this primarily for instructors who may instruct multiple
	 * subinstances that contain this discussion although strickly speaking it coudl happen for any
	 * account type if the account is enrolled in multiple subinstances of a course that contain
	 * the same named topic.	 The issue is without the contexxt of the course we are in when the topic
	 * is selected on the overview the server as multiple topics to choose from (one for each section)
	 * and it is ambiguous as to which one to select.  Now the problem with this particular hack
	 * is that when we are in a section but trying to get to the root (because the topics are set up
	 * in the root rather than the section) the provider id no longer matches the root and we 404.  In most
	 * cases the section is what contains the topic making this a non issue, but we now have courses where
	 * the topic only exists in the parent.	We need another way to pass the context of the such that we
	 * get the proper context in the event it is ambiguous.	While we have this in the context of a course (from
	 * the overview or content) we aren't going to have this in the stream right?  I think this manifests
	 * as course roulette but that is already a problem right?
	 */

	if (catalogEntry && parts && SPECIAL_ID_REGEX.test(parts.specific.type)) {
		parts.specific.$$provider = (catalogEntry.ProviderUniqueID || '').replace(/[\W-]/g, '_');
	}

	return parts.toString();
}

const HANDLES = [
	'application/vnd.nextthought.discussionref',
	'application/vnd.nextthought.discussion'
];

export default
@Registry.register(HANDLES)
class LessonOverviewGroup extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		course: PropTypes.object,
		layout: PropTypes.oneOf([Grid, List])
	}

	state = {}

	componentWillReceiveProps (nextProps) {
		const {item:nextItem, course:nextCourse} = nextProps;
		const {item:oldItem, course:oldCourse} = this.props;

		if (nextItem !== oldItem || nextCourse !== oldCourse) {
			this.setupFor(nextProps);
		}
	}


	componentDidMount () {
		this.setupFor(this.props);
	}


	setupFor (props = this.props) {
		const {item, course} = this.props;

		this.setupTopic(item, course);
		this.setupIcon(item, course);
	}


	async setupTopic (item, course) {
		const ntiids = item.NTIID ? item.NTIID.split(' ') : [];

		try {
			const topic = await this.resolveTopic(ntiids, course);
			const isForum = topic.hasOwnProperty('TopicCount');

			this.setState({
				title: topic.title,
				commentLabel: isForum ?
					t('commentLabel.topics', {count: topic.TopicCount || 0}) :
					t('commentLabel.comments', {count: topic.PostCount || 0})
			});
		} catch (e) {
			this.setState({
				disabled: true
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


	async resolveTopic (ntiids, course) {
		const id = ntiids[0];

		if (!id) { throw new Error('Unable to resolve topic'); }

		try {
			const service = await getService();
			const topic = await service.getObjectRaw(maybeFixNTIID(id, course));

			return topic;
		} catch (e) {
			return this.resolveTopic(ntiids.slice(1));
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
