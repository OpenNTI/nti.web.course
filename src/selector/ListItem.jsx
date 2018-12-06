import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import CourseCard from '../card';

export default class CourseSelectorListItem extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		onSelect: PropTypes.func,
		selected: PropTypes.bool
	}


	onClick = (e) => {
		e.preventDefault();

		const {course, onSelect} = this.props;

		if (onSelect) {
			onSelect(course);
		}
	}


	render () {
		const {course, selected} = this.props;

		return (
			<CourseCard
				className={cx('nti-course-selector-list-item', {selected})}
				course={course}
				onClick={this.onClick}
				list
			/>
		);
	}
}
