import React from 'react';
import PropTypes from 'prop-types';
import { decorate } from '@nti/lib-commons';
import { Hooks, Events } from '@nti/web-session';

import Viewer from '../viewer';

import Store from './Store';

class ContentPager extends React.Component {
	static deriveBindingFromProps(props) {
		return {
			course: props.course,
			lesson: props.lesson,
			selection: props.selection,
			requiredOnly: props.requiredOnly,
		};
	}

	static propTypes = {
		course: PropTypes.object.isRequired,
		lesson: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
			.isRequired,
		selection: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object,
			PropTypes.arrayOf(
				PropTypes.oneOfType([PropTypes.string, PropTypes.object])
			),
		]),
		requiredOnly: PropTypes.bool,

		clear: PropTypes.func,
		updateOnAssignmentSubmit: PropTypes.func,
		updateOnBatchEvent: PropTypes.func,
	};

	componentWillUnmount() {
		const { clear } = this.props;

		if (clear) {
			clear();
		}
	}

	afterBatchEvents = () => {}; //TODO: update after batch events too

	onAssignmentSubmitted = assignment => {
		const { updateOnAssignmentSubmit } = this.props;

		if (updateOnAssignmentSubmit) {
			updateOnAssignmentSubmit(assignment);
		}
	};

	render() {
		const { course, ...otherProps } = this.props;

		delete otherProps.loading;
		delete otherProps.store;
		delete otherProps.lesson;
		delete otherProps.selection;

		return <Viewer course={course} {...otherProps} />;
	}
}

export default decorate(ContentPager, [
	Store.connect([
		'clear',
		'updateOnAssignmentSubmit',
		'updateOnBatchEvent',

		'loading',
		'error',

		'location',
		'lessonInfo',

		'next',
		'nextLesson',
		'previous',
		'previousLesson',
	]),
	Hooks.afterBatchEvents(),
	Hooks.onEvent(Events.ASSIGNMENT_SUBMITTED, 'onAssignmentSubmitted'),
]);
