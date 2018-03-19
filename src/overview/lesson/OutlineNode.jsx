import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Storage from 'nti-web-storage';
import {getAppUsername} from 'nti-web-client';
import {DateTime, Layouts, Checkbox, Loading, Error} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import {Grid, List} from './Constants';
import Overview from './Overview';
import PaddedContainer from './common/PaddedContainer';

const {Responsive} = Layouts;

const RADIO_GROUP = 'nti-lesson-view-layout';
const STORAGE_KEY = 'nti-lesson-view';
const LAYOUT_STORAGE_KEY = 'layout-value';
const REQUIRED_STORAGE_KEY = 'required-only-value';

const DEFAULT_TEXT = {
	dateRangeSeparator: ' - ',
	requiredFilter: 'Only required'
};
const t = scoped('nti-web-course.overview.lesson.OutlineNode', DEFAULT_TEXT);

function getStoragePreferenceJSON () {
	try {
		const rawValue = atob(Storage.getItem(STORAGE_KEY));

		return JSON.parse(rawValue)[getAppUsername()] || {};
	} catch (e) {
		return {};
	}
}


function getStoragePreference (key) {
	return getStoragePreferenceJSON()[key];
}

function setStoragePreference (key, value) {
	// encode the value as a JSON key-value pair, where the key is
	// the acting user and the value is their selected preference
	const rawValue = JSON.stringify({
		[getAppUsername()]: {...getStoragePreferenceJSON(), [key]: value}
	});

	Storage.setItem(STORAGE_KEY, btoa(rawValue));
}

export default class LessonView extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		outlineNode: PropTypes.object,
		course: PropTypes.object.isRequired
	}

	state = {
		layout: getStoragePreference(LAYOUT_STORAGE_KEY) || Grid,
		requiredOnly: getStoragePreference(REQUIRED_STORAGE_KEY)
	}


	componentDidUpdate (prevProps, prevState) {
		const {course:oldCourse, outlineNode:oldNode} = prevProps;
		const {requiredOnly: oldRequired} = prevState;
		const {course:newCourse, outlineNode:newNode} = this.props;
		const {requiredOnly: newRequired} = this.state;

		if (oldCourse !== newCourse || oldNode !== newNode || oldRequired !== newRequired) {
			this.setupFor(this.props);
		}
	}


	componentDidMount () {
		this.setupFor(this.props);
	}


	setupFor (props = this.props) {
		this.setState({
			loading: true,
			error: null
		}, async () => {
			const {requiredOnly} = this.state;
			const {outlineNode} = this.props;

			if (!outlineNode) { return; }

			try {
				const overview = await outlineNode.getContent({requiredOnly});

				this.setState({
					loading: false,
					overview
				});
			} catch (e) {
				this.setState({
					error: e
				});
			}
		});
	}


	selectGrid = () => {
		this.setState({layout: Grid});
		setStoragePreference(LAYOUT_STORAGE_KEY, Grid);
	}


	selectList = () => {
		this.setState({layout: List});
		setStoragePreference(LAYOUT_STORAGE_KEY, List);
	}


	onFilterChange = (e) => {
		const requiredOnly = e.target.checked;

		this.setState({requiredOnly});
		setStoragePreference(REQUIRED_STORAGE_KEY, requiredOnly);
	}


	render () {
		const {className, ...otherProps} = this.props;
		const {layout, loading, error, overview} = this.state;
		const listTypeCls = layout === List ? 'nti-overview-list' : 'nti-overview-grid';

		return (
			<div className={cx('nti-lesson-view', listTypeCls, className)}>
				{loading && (<Loading.Mask />)}
				{!loading && error && (<Error error={error} />)}
				{!loading && !error && (
					<React.Fragment>
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
						<Overview {...otherProps} overview={overview} layout={layout} />
					</React.Fragment>
				)}
			</div>
		);
	}


	renderFilterRequired () {
		return <div className="required-filter"><Checkbox label={t('requiredFilter')} onChange={this.onFilterChange} checked={this.state.requiredOnly} /></div>;
	}


	renderLargeDates = () => {
		return this.renderDates('dddd, MMMM Do');
	}


	renderSmallDates = () => {
		return this.renderDates('ddd, MMM Do');
	}


	renderDates (format) {
		const {course, outlineNode} = this.props;

		if (!outlienNode) { return null; }

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
