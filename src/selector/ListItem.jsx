import './ListItem.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import CourseCard from '../card';
import { AllowBadges } from '../card/parts/Card';

export default class CourseSelectorListItem extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired,
		onSelect: PropTypes.func,
		selected: PropTypes.bool,
	};

	onClick = e => {
		e.preventDefault();

		const { course, onSelect } = this.props;

		if (onSelect) {
			onSelect(course);
		}
	};

	render() {
		const { course, selected } = this.props;

		return (
			<AllowBadges.Provider value={false}>
				<CourseCard
					className={cx('nti-course-selector-list-item', {
						selected,
					})}
					course={course.CatalogEntry || course}
					onClick={this.onClick}
					list
				/>
			</AllowBadges.Provider>
		);
	}
}
