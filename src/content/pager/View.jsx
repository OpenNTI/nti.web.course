import React from 'react';
import PropTypes from 'prop-types';

import Viewer from '../viewer';

import Store from './Store';

export default
@Store.connect([
	'loading',
	'error',

	'location',
	'lessonInfo',

	'next',
	'nextLesson',
	'previous',
	'previousLesson'
])
class ContentPager extends React.Component {
	static deriveBindingFromProps (props) {
		return {
			course: props.course,
			lesson: props.lesson,
			selection: props.selection,
			requiredOnly: props.requiredOnly
		};
	}

	static propTypes = {
		course: PropTypes.object.isRequired,
		lesson: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]).isRequired,
		selection: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object,
			PropTypes.arrayOf(
				PropTypes.oneOfType([
					PropTypes.string,
					PropTypes.object
				])
			)
		]),
		requiredOnly: PropTypes.bool
	}


	render () {
		const {course, ...otherProps} = this.props;

		delete otherProps.loading;
		delete otherProps.store;
		delete otherProps.lesson;
		delete otherProps.selection;

		return (
			<Viewer course={course} {...otherProps} />
		);
	}
}
