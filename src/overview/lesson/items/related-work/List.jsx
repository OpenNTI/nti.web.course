import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {AssetIcon} from 'nti-web-commons';
import {isNTIID} from 'nti-lib-ntiids';

import Base from '../../common/BaseListItem';

const isExternal = (item) => /external/i.test(item.type) || !isNTIID(item.href);

const DEFAULT_TEXT = {
	byline: 'By %(name)s'
};
const t = scoped('nti-web-course.overview.lesson.overview.RelatedWorkListItem', DEFAULT_TEXT);

export default class LessonOverviewRelatedWorkListItem extends React.Component {
	static propTypes = {
		item: PropTypes.object
	}


	render () {
		const {item} = this.props;
		const {byline} = item;


		return (
			<Base
				className="lesson-overview-related-work-list-item"
				item={item}
				renderIcon={this.renderIcon}
				labels={[
					byline ? t('byline', {name: byline}) : null
				]}
			/>
		);
	}


	renderIcon = () => {
		const {item} = this.props;
		const type = [item.type, item.targetMimeType].filter(x => x);

		return (
			<AssetIcon
				className="lesson-overview-related-work-list-item-icon"
				src={item.icon}
				mimeType={type}
				href={item.href}
			>
				{isExternal(item) && (<div className="external" />)}
			</AssetIcon>
		);
	}
}
