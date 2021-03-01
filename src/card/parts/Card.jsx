import './Card.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Hooks } from '@nti/web-commons';

import Image from './Image';
import Title from './Title';
import Authors from './Authors';

const { useMediaQuery } = Hooks;

const VARIANTS = {
	LIST: 'list-item',
	CARD: 'card',
	AUTO: 'auto',
};

const ASSETS = {
	[VARIANTS.LIST]: 'thumb',
};

CourseCard.propTypes = {
	className: PropTypes.string,
	course: PropTypes.object.isRequired,
	badges: PropTypes.arrayOf(PropTypes.node),

	variant: PropTypes.oneOf(Object.values(VARIANTS)),

	progress: PropTypes.number,
	onClick: PropTypes.func,
};
export default function CourseCard({
	className,
	course,
	badges,
	variant = 'card',
	progress,
	onClick,
}) {
	const { matches } = useMediaQuery('(max-width: 736px)');
	if (variant === 'auto') {
		variant = matches ? 'list-item' : 'card';
	}

	return (
		<div
			data-testid="course-card"
			onClick={onClick}
			className={cx(className, 'nti-course-card-container', variant)}
		>
			<Image course={course} type={ASSETS[variant]} />
			<div className="meta">
				<Title course={course} variant={variant} />
				<Authors course={course} variant={variant} />
			</div>
			{badges && (
				<ul className="badges">
					{badges.map((badge, key) => {
						return <li key={key}>{badge}</li>;
					})}
				</ul>
			)}

			{progress !== undefined && progress > 0 && (
				<div
					className="progress"
					data-testid="progress-bar"
					style={{ width: progress * 100 + '%' }}
				/>
			)}
		</div>
	);
}
