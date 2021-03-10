import './Card.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Hooks } from '@nti/web-commons';

import Image from './Image';
import Title from './Title';
import Authors from './Authors';

const { useListItemVariant } = Hooks;

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
	variant: v = 'card',
	progress,
	onClick,
}) {
	const variant = useListItemVariant(v);

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

			<Progress progress={progress} />
		</div>
	);
}

const Progress = ({ progress = 0 }) => {
	return !progress ? null : (
		<div
			className="progress"
			data-testid="progress-bar"
			style={{ '--progress-value': progress * 100 + '%' }}
		/>
	);
};
