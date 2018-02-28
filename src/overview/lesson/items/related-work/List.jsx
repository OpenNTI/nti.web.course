import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import Base from '../../common/BaseListItem';

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
					t('byline', {name: byline})
				]}
			/>
		);
	}


	renderIcon = () => {
		const {item} = this.props;
		const {icon} = item;

		return (
			<div className="lesson-overview-related-work-list-item-icon">
				<img src={icon} />
			</div>
		);
	}
}
