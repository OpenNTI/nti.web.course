import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Image from './Image';
import Title from './Title';
import Authors from './Authors';


CourseCard.propTypes = {
	className: PropTypes.string,
	course: PropTypes.object.isRequired,
	badges: PropTypes.arrayOf(PropTypes.node),
	card: PropTypes.bool,
	list: PropTypes.bool,
	collapseToList: PropTypes.bool
};
export default function CourseCard ({className, course, badges, card = true, list, collapseToList}) {
	return (
		<div className={cx(className, 'nti-course-card-container', {card: card && !list && !collapseToList, list, 'collapse-to-list': collapseToList})}>
			<Image course={course} />
			<div className="meta">
				<Title course={course} />
				<Authors course={course} />
			</div>
			{badges && (
				<ul className="badges">
					{badges.map((badge, key) => {
						return (
							<li key={key}>
								{badge}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
