import React from 'react';
import PropTypes from 'prop-types';
import {Card} from '@nti/web-commons';
import {LinkTo} from '@nti/web-routing';

import PaddedContainer from '../../common/PaddedContainer';

LessonOverviewTimelineGridItem.propTypes = {
	item: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired
};
export default function LessonOverviewTimelineGridItem ({item, course}) {
	return (
		<PaddedContainer>
			<LinkTo.Object object={item}>
				<Card
					data-ntiid={item.NTIID}
					item={item}
					contentPackage={course}
					internalOverride
				/>
			</LinkTo.Object>
		</PaddedContainer>
	);
}
