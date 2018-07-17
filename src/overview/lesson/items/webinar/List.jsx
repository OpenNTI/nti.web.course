import React from 'react';
import PropTypes from 'prop-types';

import PaddedContainer from '../../common/PaddedContainer';

import BaseItem from './BaseItem';

WebinarListItem.propTypes = {
	item: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired
};
export default function WebinarListItem ({ item, course }) {
	return (
		<PaddedContainer>
			<BaseItem item={item} course={course} isMinimal/>
		</PaddedContainer>
	);
}
