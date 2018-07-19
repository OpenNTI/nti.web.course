import React from 'react';
import PropTypes from 'prop-types';

import Base from '../../common/BaseListItem';

LTIExternalToolAssetListItem.propTypes = {
	requiredLabel: PropTypes.node
};

export default function LTIExternalToolAssetListItem (props) {
	return (
		<Base {...props} labels={[props.requiredLabel]} />
	);
}
