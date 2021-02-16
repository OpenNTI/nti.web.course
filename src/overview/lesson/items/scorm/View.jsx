import React from 'react';
import PropTypes from 'prop-types';
import { Summary } from '@nti/lib-interfaces';
import { scoped } from '@nti/lib-locale';

import Registry from '../Registry';
import { List, Grid } from '../../Constants';
import Required from '../../common/Required';
import RequirementControl from '../../../../progress/widgets/RequirementControl';

import CompletionLabel from './CompletionLabel';
import ListCmp from './List';
import GridCmp from './Grid';

const t = scoped('course.overview.lessons.items.scorm', {
	comments: {
		one: '%(count)s Comment',
		other: '%(count)s Comments',
	},
	viewComments: 'View Comments',
});

export default class LessonOverviewScormItem extends React.Component {
	static propTypes = {
		layout: PropTypes.oneOf([List, Grid]),
		item: PropTypes.object,
		course: PropTypes.object,
		editMode: PropTypes.bool,
		onRequirementChange: PropTypes.func,
	};

	render() {
		const {
			layout,
			item,
			editMode,
			onRequirementChange,
			...otherProps
		} = this.props;
		const Cmp = layout === List ? ListCmp : GridCmp;

		const completionLabel =
			item.hasCompleted && item.hasCompleted() ? (
				<CompletionLabel item={item} />
			) : null;

		const commentCount = item[Summary] && item[Summary].ItemCount;
		const commentLabel =
			typeof commentCount !== 'number'
				? t('viewComments')
				: t('comments', { count: commentCount });

		const requireChange = value =>
			onRequirementChange(value, item.ScormContentInfo);
		const required = item.CompletionRequired;
		const requiredLabel =
			item &&
			item.isCompletable &&
			item.isCompletable() &&
			onRequirementChange ? (
				<RequirementControl
					key={`${item.scormId}-requirement`}
					record={item.ScormContentInfo}
					onChange={requireChange}
				/>
			) : (
				required && <Required key="required-label" />
			);

		return (
			<Cmp
				layout={layout}
				item={item}
				commentLabel={!editMode && commentLabel}
				requiredLabel={requiredLabel}
				completionLabel={completionLabel}
				{...otherProps}
			/>
		);
	}
}

Registry.register('application/vnd.nextthought.scormcontentref')(
	LessonOverviewScormItem
);
