import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import Base from '../../common/BaseListItem';


const DEFAULT_TEXT = {
	byline: 'By %(name)s'
};
const t = scoped('web-course.overview.lesson.overview.lti.List', DEFAULT_TEXT);

LTIExternalToolAssetListItem.propTypes = {
	item: PropTypes.object.isRequired,
	requiredLabel: PropTypes.node,
	commentLabel: PropTypes.node
};

export default function LTIExternalToolAssetListItem (props) {
	const {item, commentLabel} = props;
	const {byline} = item;

	return (
		<Base {...props} labels={[
			props.requiredLabel,
			byline ? t('byline', {name: byline}) : null,
			commentLabel
		]} />
	);
}
