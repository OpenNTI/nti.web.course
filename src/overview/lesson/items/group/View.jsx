import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {Grid, List} from '../../Constants';
import {collateDiscussions} from '../discussion/Collator';
import Registry from '../Registry';
import Items from '../View';

export default
@Registry.register('application/vnd.nextthought.nticourseoverviewgroup')
class LessonOverviewGroup extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		layout: PropTypes.oneOf([Grid, List])
	}

	render () {
		const {item, layout, ...otherProps} = this.props;
		const {title, accentColor, Items:items} = item;
		const isGrid = layout === Grid;

		const subItems = isGrid ? collateDiscussions(items) : items;

		return (
			<div className={cx('lesson-overview-group', {list: !isGrid, grid: isGrid})}>
				{isGrid && (<h2 style={{backgroundColor: `#${accentColor}`}}>{title}</h2>)}
				<Items items={subItems} layout={layout} {...otherProps} />
			</div>
		);
	}
}
