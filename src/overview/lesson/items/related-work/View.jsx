import React from 'react';
import PropTypes from 'prop-types';
import {Summary} from 'nti-lib-interfaces';
import {scoped} from 'nti-lib-locale';
import {LinkTo} from 'nti-web-routing';

import {List, Grid} from '../../Constants';
import Registry from '../Registry';

import ListCmp from './List';
import GridCmp from './Grid';

const DEFAULT_TEXT = {
	comments: {
		one: '%(count)s Comment',
		other: '%(count)s Comments'
	},
	viewComments: 'View Comments'
};
const t = scoped('course.overview.lessons.items.related-work.Grid', DEFAULT_TEXT);

export default
@Registry.register('application/vnd.nextthought.relatedworkref')
class LessonOverviewRelatedWork extends React.Component {
	static propTypes = {
		layout: PropTypes.oneOf([List, Grid]),
		item: PropTypes.object
	}

	render () {
		const {layout, item, ...otherProps} = this.props;

		const Cmp = layout === List ? ListCmp : GridCmp;

		let commentCount = item[Summary];

		if (commentCount) {
			commentCount = commentCount.ItemCount;
		}

		if (typeof commentCount !== 'number') {
			commentCount = t('viewComments');
		} else {
			commentCount = t('comments', {count: commentCount});
		}

		const commentLabel = (
			<LinkTo.Object key={item.getID()} object={item} context="discussions" className="comment-count">
				{commentCount}
			</LinkTo.Object>
		);

		return (
			<Cmp layout={layout} item={item} commentLabel={commentLabel} {...otherProps} />
		);
	}
}
