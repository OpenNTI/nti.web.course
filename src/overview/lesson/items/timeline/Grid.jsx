import React from 'react';
import PropTypes from 'prop-types';
import {Card} from 'nti-web-commons';

import PaddedContainer from '../../common/PaddedContainer';

LessonOverviewTimelineGridItem.propTypes = {
	item: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired
};
export default function LessonOverviewTimelineGridItem ({item, course}) {
	return (
		<PaddedContainer>
			<Card item={item} contentPackage={course} internalOverride/>
		</PaddedContainer>
	);
}

