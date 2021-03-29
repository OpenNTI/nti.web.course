import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Color} from '@nti/lib-commons';

import { Grid, List } from '../../Constants';
import { collateDiscussions } from '../discussion/Collator';
import Registry from '../Registry';
import Items from '../View';

const White = Color.fromHex('#fff');
const settings = {level:'AA',size:'large'};
export default class LessonOverviewGroup extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		layout: PropTypes.oneOf([Grid, List]),
	};

	render() {
		const { item, layout, ...otherProps } = this.props;
		const { title, accentColor, Items: items } = item;
		const isGrid = layout === Grid;
		const dark = !White.a11y.isReadable(accentColor, settings);

		return !items || !items.length ? null : (
			<div
				className={cx('lesson-overview-group', {
					[List]: !isGrid,
					[Grid]: isGrid,
					dark
				})}
			>
				{isGrid && (
					<h2 style={{ backgroundColor: `#${accentColor}` }}>
						{title}
					</h2>
				)}
				<Items
					items={isGrid ? collateDiscussions(items) : items}
					layout={layout}
					{...otherProps}
				/>
			</div>
		);
	}
}

Registry.register('application/vnd.nextthought.nticourseoverviewgroup')(
	LessonOverviewGroup
);
