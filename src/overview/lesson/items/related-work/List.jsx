import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import Base from '../../common/BaseListItem';


const DEFAULT_TEXT = {
	byline: 'By %(name)s'
};
const t = scoped('web-course.overview.lesson.overview.RelatedWorkListItem', DEFAULT_TEXT);

export default class LessonOverviewRelatedWorkListItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		commentLabel: PropTypes.node,
		requiredLabel: PropTypes.node,
		onClick: PropTypes.func,
	}


	render () {
		const {item, commentLabel, requiredLabel, onClick, ...otherProps} = this.props;
		const {byline} = item;


		return (
			<Base
				{...otherProps}
				onClick={onClick}
				className="lesson-overview-related-work-list-item"
				item={item}
				labels={[
					requiredLabel,
					byline ? t('byline', {name: byline}) : null,
					commentLabel
				]}
			/>
		);
	}
}
