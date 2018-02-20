import React from 'react';
import PropTypes from 'prop-types';

import Container from '../../Container';

import Item from './item/';

function flatten (overview) {
	const {Items} = overview;

	return Items.reduce((acc, item) => {
		if (item.Items) {
			acc = [...acc, ...flatten(item)];
		} else {
			acc.push(item);
		}

		return acc;
	}, []);
}

LessonOverview.propTypes = {
	overview: PropTypes.object.isRequired
};
export default function LessonOverview ({overview}) {
	const items = flatten(overview);

	debugger;

	return (
		<div className="course-progress-lesson-overview">
			<Container className="overview-meta">
				<h1>{overview.title}</h1>
			</Container>
			<ul>
				{items.map((item, index) => {
					return (
						<li key={index} >
							<Item item={item} />
						</li>
					);
				})}
			</ul>
		</div>
	);
}
