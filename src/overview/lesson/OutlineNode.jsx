import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Storage from 'nti-web-storage';
import {getAppUsername} from 'nti-web-client';
import {DateTime, Layouts, Checkbox} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import {Grid, List} from './Constants';
import Overview from './Overview';
import PaddedContainer from './common/PaddedContainer';

const {Responsive} = Layouts;

const RADIO_GROUP = 'nti-lesson-view-layout';
const STORAGE_KEY = 'nti-lesson-view-layout-value';

const DEFAULT_TEXT = {
	dateRangeSeparator: ' - ',
	requiredFilter: 'Only required'
};
const t = scoped('nti-web-course.overview.lesson.OutlineNode', DEFAULT_TEXT);

export default class LessonView extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		outlineNode: PropTypes.object,
		course: PropTypes.object.isRequired
	}

	state = {
		layout: this.getStoragePreference()
	}


	getStoragePreference () {
		try {
			// get encoded value from storage, decode, parse and get the value
			// for the acting user.  If no entry, or the entry is not this user,
			// return Grid as default
			const rawValue = atob(Storage.getItem(STORAGE_KEY));
			const jsonValue = JSON.parse(rawValue);
			return jsonValue[getAppUsername()] || Grid;
		} catch (e) {
			return Grid;
		}
	}

	setStoragePreference (value) {
		// encode the value as a JSON key-value pair, where the key is
		// the acting user and the value is their selected preference
		const rawValue = JSON.stringify({
			[getAppUsername()]: value
		});

		Storage.setItem(STORAGE_KEY, btoa(rawValue));
	}

	selectGrid = () => {
		this.setState({layout: Grid});
		this.setStoragePreference(Grid);
	}


	selectList = () => {
		this.setState({layout: List});
		this.setStoragePreference(List);
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

	onFilterChange = (e) => {
		// console.log(e.target.value);
	}


	renderFilterRequired () {
		return <div className="required-filter"><Checkbox label={t('requiredFilter')} onChange={this.onFilterChange}/></div>;
	}


	render () {
		const {className, ...otherProps} = this.props;
		const {layout} = this.state;
		const listTypeCls = layout === List ? 'nti-overview-list' : 'nti-overview-grid';

		return (
			<div className={cx('nti-lesson-view', listTypeCls, className)}>
				<PaddedContainer className="header">
					{layout === List && this.renderFilterRequired()}
					<Responsive.Item query={Responsive.isMobile} render={this.renderSmallDates} />
					<Responsive.Item query={Responsive.isTablet} render={this.renderLargeDates} />
					<Responsive.Item query={Responsive.isDesktop} render={this.renderLargeDates} />
					<div className="spacer" />
					<div className="layout-toggle">
						<label className="grid">
							<input type="radio" group={RADIO_GROUP} name="grid" checked={layout === Grid} onChange={this.selectGrid} />
							<div className="toggle">
								<i className="icon-grid" />
							</div>
						</label>
						<label className="list">
							<input type="radio" group={RADIO_GROUP} name="list" checked={layout === List} onChange={this.selectList} />
							<div className="toggle">
								<i className="icon-list" />
							</div>
						</label>
					</div>
				</PaddedContainer>
				<Overview {...otherProps} layout={layout} />
			</div>
		);
	}
}
