import React from 'react';
import PropTypes from 'prop-types';
import { getEventTarget } from 'nti-lib-dom';
import { Summary } from 'nti-lib-interfaces';
import { scoped } from 'nti-lib-locale';
import { LinkTo } from 'nti-web-routing';

import { List, Grid } from '../../Constants';
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
const t = scoped('course.overview.lessons.items.related-work', DEFAULT_TEXT);

export default
@Registry.register('application/vnd.nextthought.relatedworkref')
class LessonOverviewRelatedWork extends React.Component {
	static propTypes = {
		layout: PropTypes.oneOf([List, Grid]),
		item: PropTypes.object,
		course: PropTypes.object,
		outlineNode: PropTypes.object
	}

	static contextTypes = {
		analyticsManager: PropTypes.object.isRequired
	}

	maybeSendExternalViewEvent = (e) => {
		const {context: {analyticsManager}, props: {course, outlineNode, item}} = this;
		const link = getEventTarget(e, '[href]');
		const externalLink = getEventTarget(e, 'a[href][target]');

		if (externalLink && link === externalLink) {

			const resourceId = item.NTIID || item.ntiid; //Cards built from DOM have lowercase.

			analyticsManager.ExternalResourceView.send(resourceId, {
				context: analyticsManager.toAnalyticsPath([
					course.NTIID,
					outlineNode.NTIID,
					outlineNode.ContentNTIID,
				], resourceId)
			});
		}
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
			commentCount = t('comments', {count: commentCount });
		}

		const commentLabel = (
			<LinkTo.Object key={item.getID()} object={item} context="discussions" className="comment-count">
				{commentCount}
			</LinkTo.Object>
		);

		const required = item.CompletionRequired;

		const requiredLabel = required && (
			<div key="required-label" className="required">Required</div>
		);

		return (
			<Cmp
				onClick={this.maybeSendExternalViewEvent}
				layout={layout}
				item={item}
				commentLabel={commentLabel}
				requiredLabel={requiredLabel}
				{...otherProps} />
		);
	}
}
