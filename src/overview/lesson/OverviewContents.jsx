import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {Grid, List} from './Constants';
import Items from './items';

export default class LessonOverview extends React.Component {
	static Grid = Grid
	static List = List

	static propTypes = {
		overview: PropTypes.object,
		outlineNode: PropTypes.object,
		course: PropTypes.object.isRequired,

		className: PropTypes.string,

		layout: PropTypes.oneOf([Grid, List]),
		requiredOnly: PropTypes.bool
	}

	static defaultProps = {
		layout: Grid
	}


	render () {
		const {overview, outlineNode, className, layout} = this.props;
		const loading = !overview || !outlineNode;

		return (
			<div className={cx('nti-lesson-overview', className, layout.toLowerCase(), {loading})}>
				{!loading && this.renderOverview()}
			</div>
		);
	}


	renderOverview () {
		const {overview, course, outlineNode, layout, ...otherProps} = this.props;
		const {Items:items} = overview;

		return (
			<React.Fragment>
				{items && items.length ?
					(
						<Items
							items={items}
							overview={overview}
							course={course}
							outlineNode={outlineNode}
							layout={layout}
							{...otherProps}

						/>
					) :
					this.renderEmpty()
				}
			</React.Fragment>
		);
	}


	renderEmpty () {
		return null;
	}
}
