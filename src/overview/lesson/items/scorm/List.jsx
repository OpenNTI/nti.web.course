import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import Base from '../../common/BaseListItem';

const DEFAULT_TEXT = {
	byline: 'By %(name)s'
};
const t = scoped('web-course.overview.lesson.overview.RelatedWorkListItem', DEFAULT_TEXT);

export default class LessonOverviewScormListItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		commentLabel: PropTypes.node,
		requiredLabel: PropTypes.node
	}


	render () {
		const {item, commentLabel, requiredLabel, ...otherProps} = this.props;
		const {byline} = item;


		return (
			<Base
				{...otherProps}
				className="lesson-overview-scorm-list-item"
				item={item}
				labels={[
					requiredLabel,
					byline ? t('byline', {name: byline}) : null,
					commentLabel,
				]}
			/>
		);
	}
}