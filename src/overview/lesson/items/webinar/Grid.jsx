import React from 'react';
import PropTypes from 'prop-types';

import PaddedContainer from '../../common/PaddedContainer';

import BaseItem from './BaseItem';

WebinarGridItem.propTypes = {
	item: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired
};
export default function WebinarGridItem ({ item, course }) {
	return (
		<PaddedContainer>
			<BaseItem item={item} course={course}/>
		</PaddedContainer>
	);
}
