import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Loading} from 'nti-web-commons';

import {Grid, List} from './Constants';
import Items from './items';
import PaddedContainer from './common/PaddedContainer';

export default class LessonOverview extends React.Component {
	static Grid = Grid
	static List = List

	static propTypes = {
		overview: PropTypes.object,
		outlineNode: PropTypes.object,
		course: PropTypes.object.isRequired,

		className: PropTypes.string,

		layout: PropTypes.oneOf([Grid, List])
	}

	static defaultProps = {
		layout: Grid
	}


	render () {
		const {overview, outlineNode, className, layout} = this.props;
		const loading = !overview || !outlineNode;

		return (
			<div className={cx('nti-lesson-overview', className, layout.toLowerCase(), {loading})}>
				{loading && (<Loading.Mask />)}
				{!loading && this.renderOverview()}
			</div>
		);
	}


	renderOverview () {
		const {overview, course, outlineNode, layout} = this.props;
		const {Items:items} = overview;

		return (
			<React.Fragment>
				<PaddedContainer className="header">
					<h1>{overview.title}</h1>
				</PaddedContainer>
				{items && items.length ?
					(
						<Items
							items={items}
							overview={overview}
							course={course}
							outlineNode={outlineNode}
							layout={layout}
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
