import './Card.scss';
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
	collapseToList: PropTypes.bool,
	progress: PropTypes.number,
	onClick: PropTypes.func
};
export default function CourseCard ({className, course, badges, card = true, list, collapseToList, progress, onClick}) {
	return (
		<div
			onClick={onClick}
			className={cx(className, 'nti-course-card-container', {card: card && !list && !collapseToList, list, 'collapse-to-list': collapseToList})}
		>
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

			{progress !== undefined && progress > 0 &&
				<div className="progress" data-testid="progress-bar" style={{width: progress * 100 + '%'}} />
			}
		</div>
	);
}
