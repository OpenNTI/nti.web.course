import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Loading, DateTime, Layouts} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import {Grid, List} from './Constants';
import Items from './items';
import PaddedContainer from './common/PaddedContainer';

const {Responsive} = Layouts;

const DEFAULT_TEXT = {
	dateRangeSeparator: ' - '
};
const t = scoped('nti-web-course.overview.lesson.Overview', DEFAULT_TEXT);

export default class LessonOverview extends React.Component {
	static Grid = Grid
	static List = List

	static propTypes = {
		overview: PropTypes.object,
		outlineNode: PropTypes.object,
		course: PropTypes.object,

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

		return (
			<React.Fragment>
				<PaddedContainer className="header">
					<Responsive.Item query={Responsive.isMobile} render={this.renderSmallDates} />
					<Responsive.Item query={Responsive.isTablet} render={this.renderLargeDates} />
					<Responsive.Item query={Responsive.isDesktop} render={this.renderLargeDates} />
					<h1>{overview.title}</h1>
				</PaddedContainer>
				<Items
					items={overview.Items}
					overview={overview}
					course={course}
					outlineNode={outlineNode}
					layout={layout}
				/>
			</React.Fragment>
		);
	}


	renderLargeDates = () => {
		return this.renderDates('dddd, MMMM Do');
	}


	renderSmallDates = () => {
		return this.renderDates('ddd, MMM Do');
	}


	renderDates (format) {
		const {course, outlineNode} = this.props;
		const beginning = outlineNode.getAvailableBeginning();
		const ending = outlineNode.getAvailableEnding();
		const courseStart = course.CatalogEntry.getStartDate();

		if (!beginning && !courseStart) { return null; }

		return (
			<div className="dates">
				{beginning && (<DateTime date={beginning} format={format} />)}
				{!beginning && courseStart && (<DateTime date={courseStart} format={format} />)}
				{ending && (<span className="separator">{t('dateRangeSeparator')}</span>)}
				{ending && (<DateTime date={ending} format={format} />)}
			</div>
		);
	}
}

