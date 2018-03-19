import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';
import {Checkbox, Layouts, DateTime} from 'nti-web-commons';

import {List, Grid} from './Constants';
import PaddedContainer from './common/PaddedContainer';

const t = scoped('course.overview.lesson.Header', {
	dateRangeSeparator: ' - ',
	requiredFilter: 'Only Required'
});

const {Responsive} = Layouts;

const LAYOUT_GROUP = 'nti-lesson-view-layout';

export default class CourseOverviewLessonHeader extends React.Component {
	static propTypes = {
		overview: PropTypes.object,
		outlineNode: PropTypes.object,
		course: PropTypes.object,

		layout: PropTypes.oneOf([List, Grid]),
		requiredOnly: PropTypes.bool,

		setLayout: PropTypes.func,
		setRequiredOnly: PropTypes.func
	}


	selectGrid = () => {
		const {setLayout} = this.props;

		if (setLayout) {
			setLayout(Grid);
		}
	}


	selectList = () => {
		const {setLayout} = this.props;

		if (setLayout) {
			setLayout(List);
		}
	}


	onRequiredFilterChange = (e) => {
		const {setRequiredOnly} = this.props;

		if (setRequiredOnly) {
			setRequiredOnly(e.target.checked);
		}
	}


	render () {
		const {overview, outlineNode, layout} = this.props;

		if (!overview || !outlineNode) { return null; }

		return (
			<div className={cx('course-overview-lesson-header', layout)}>
				{layout === List ? this.renderList() : null}
				{layout === Grid ? this.renderGrid() : null}
			</div>
		);
	}


	renderList () {
		return (
			<React.Fragment>
				<PaddedContainer className="bar">
					{this.renderFilterCheckbox()}
					<div className="spacer" />
					{this.renderLayoutToggle()}
				</PaddedContainer>
				<PaddedContainer>
					{this.renderOutlineNodeDates()}
					{this.renderTitle()}
				</PaddedContainer>
			</React.Fragment>
		);
	}


	renderGrid () {
		return (
			<React.Fragment>
				<PaddedContainer className="bar">
					{this.renderOutlineNodeDates()}
					<div className="spacer" />
					{this.renderLayoutToggle()}
				</PaddedContainer>
				<PaddedContainer>
					{this.renderTitle()}
				</PaddedContainer>
			</React.Fragment>
		);
	}


	renderFilterCheckbox () {
		const {course, requiredOnly} = this.props;

		if (!course.CompletionPolicy) { return null; }

		return (
			<div className="required-filter">
				<Checkbox label={t('requiredFilter')} onChange={this.onRequiredFilterChange} checked={requiredOnly} />
			</div>
		);
	}


	renderLayoutToggle () {
		const {layout} = this.props;

		return (
			<div className="layout-toggle">
				<label className="grid">
					<input type="radio" group={LAYOUT_GROUP} name="grid" checked={layout === Grid} onChange={this.selectGrid} />
					<div className="toggle">
						<i className="icon-grid" />
					</div>
				</label>
				<label className="list">
					<input type="radio" group={LAYOUT_GROUP} name="list" checked={layout === List} onChange={this.selectList} />
					<div className="toggle">
						<i className="icon-list" />
					</div>
				</label>
			</div>
		);
	}


	renderOutlineNodeDates () {
		return (
			<React.Fragment>
				<Responsive.Item query={Responsive.isMobile} render={this.renderSmallDates} />
				<Responsive.Item query={Responsive.isTablet} render={this.renderLargeDates} />
				<Responsive.Item query={Responsive.isDesktop} render={this.renderLargeDates} />
			</React.Fragment>
		);
	}


	renderSmallDates = () => {
		return this.renderDates('ddd, MMM Do');
	}


	renderLargeDates = () => {
		return this.renderDates('dddd, MMMM Do');
	}


	renderDates (format) {
		const {outlineNode, course} = this.props;

		if (!outlineNode) { return null; }

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


	renderTitle () {
		const {overview} = this.props;

		return (
			<h1 className="title">{overview.title}</h1>
		);
	}
}
