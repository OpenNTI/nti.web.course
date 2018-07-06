import React from 'react';
import PropTypes from 'prop-types';

import PaddedContainer from '../../common/PaddedContainer';

WebinarGridItem.propTypes = {
	item: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired
};
export default function WebinarGridItem ({ item, course }) {
	return (
		<PaddedContainer>
			<div>Webinar item</div>
		</PaddedContainer>
	);
}
