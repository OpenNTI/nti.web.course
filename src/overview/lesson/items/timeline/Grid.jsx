import React from 'react';
import PropTypes from 'prop-types';
import {Card} from '@nti/web-commons';
import {LinkTo} from '@nti/web-routing';

import PaddedContainer from '../../common/PaddedContainer';

LessonOverviewTimelineGridItem.propTypes = {
	item: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired,
	noProgress: PropTypes.bool
};
export default function LessonOverviewTimelineGridItem ({item, course, noProgress}) {
	return (
		<PaddedContainer>
			<LinkTo.Object object={item}>
				<Card
					data-ntiid={item.NTIID}
					item={item}
					contentPackage={course}
					noProgress={noProgress}
					internalOverride
				/>
			</LinkTo.Object>
		</PaddedContainer>
	);
}
