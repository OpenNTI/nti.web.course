import React from 'react';
import PropTypes from 'prop-types';
import {Card} from '@nti/web-commons';
import {LinkTo} from '@nti/web-routing';

import PaddedContainer from '../../common/PaddedContainer';


LessonOverviewScormGridItem.propTypes = {
	item: PropTypes.object.isRequired,
	course: PropTypes.object,
	commentLabel: PropTypes.node,
	requiredLabel: PropTypes.node,
	noProgress: PropTypes.bool
};
export default function LessonOverviewScormGridItem ({item, course, commentLabel, requiredLabel, noProgress}) {
	return (
		<PaddedContainer>
			<LinkTo.Object object={item}>
				<div className="card">
					<Card
						data-ntiid={item.NTIID}
						item={item}
						contentPackage={course}
						labels={[requiredLabel, commentLabel]}
						noProgress={noProgress}
					/>
				</div>
			</LinkTo.Object>
		</PaddedContainer>
	);
}