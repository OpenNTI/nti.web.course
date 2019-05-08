import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@nti/web-commons';
import { LinkTo } from '@nti/web-routing';

import PaddedContainer from '../../common/PaddedContainer';

LTIExternalToolAssetGridItem.propTypes = {
	item: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired,
	requiredLabel: PropTypes.node,
	commentLabel: PropTypes.node,
	noProgress: PropTypes.bool
};
export default function LTIExternalToolAssetGridItem ({ item, requiredLabel, commentLabel, course, noProgress }) {
	return (
		<PaddedContainer>
			<LinkTo.Object object={item}>
				<Card
					data-ntiid={item.NTIID}
					item={item}
					contentPackage={course}
					labels={[requiredLabel, commentLabel]}
					noProgress={noProgress}
				/>
			</LinkTo.Object>
		</PaddedContainer>
	);
}
