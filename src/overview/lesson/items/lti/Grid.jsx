import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@nti/web-commons';
import { LinkTo } from '@nti/web-routing';

import PaddedContainer from '../../common/PaddedContainer';

LTIExternalToolAssetGridItem.propTypes = {
	item: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired,
	requiredLabel: PropTypes.node
};
export default function LTIExternalToolAssetGridItem ({ item, requiredLabel, course }) {
	return (
		<PaddedContainer>
			<LinkTo.Object object={item}>
				<Card
					data-ntiid={item.NTIID}
					item={item}
					contentPackage={course}
					labels={[requiredLabel]}
				/>
			</LinkTo.Object>
		</PaddedContainer>
	);
}
