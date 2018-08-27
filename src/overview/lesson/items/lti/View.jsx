import React from 'react';
import PropTypes from 'prop-types';
import { Summary } from '@nti/lib-interfaces';
import { LinkTo } from '@nti/web-routing';
import { scoped } from '@nti/lib-locale';

import RequirementControl from '../../../../progress/widgets/RequirementControl';
import Required from '../../common/Required';
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
const t = scoped('course.overview.lessons.items.ltiexternaltoolasset', DEFAULT_TEXT);

export default
@Registry.register('application/vnd.nextthought.ltiexternaltoolasset')
class LTIExternalToolAsset extends React.Component {
	static propTypes = {
		layout: PropTypes.oneOf([Grid, List]),
		item: PropTypes.object,
		editMode: PropTypes.bool,
		onRequirementChange: PropTypes.func
	}

	render () {
		const { layout, item, editMode, onRequirementChange, ...otherProps } = this.props;

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

		const requiredLabel = item && item.isCompletable && item.isCompletable() && onRequirementChange ? (
			<RequirementControl record={item} onChange={onRequirementChange}/>
		) : required && (
			<Required key="required-label"/>
		);

		return (
			<Cmp layout={layout} item={item} requiredLabel={requiredLabel} {...otherProps} commentLabel={!editMode && commentLabel}/>
		);
	}
}
