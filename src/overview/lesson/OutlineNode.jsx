import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Storage from '@nti/web-storage';
import {getAppUsername} from '@nti/web-client';
import {Loading, Error as ErrorCmp} from '@nti/web-commons';

import CourseItemProgress from './common/CourseItemProgress';
import {Grid, List} from './Constants';
import Header from './Header';
import OverviewContents from './OverviewContents';

const STORAGE_KEY = 'nti-lesson-view';
const LAYOUT_STORAGE_KEY = 'layout-value';
const REQUIRED_STORAGE_KEY = 'required-only-value';

const changed = (A, B, keys = []) => keys.some(x => A[x] !== B[x]);

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
	static isFilteredToRequired () {
		const requiredOnly = getStoragePreference(REQUIRED_STORAGE_KEY);
		const layout = getStoragePreference(LAYOUT_STORAGE_KEY) || Grid;

		return requiredOnly && layout !== Grid;
	}

	static propTypes = {
		className: PropTypes.string,
		outlineNode: PropTypes.object,
		course: PropTypes.object.isRequired
	}

	constructor (props) {
		super(props);
		// Since the default values of this state object are computed, we want the object assigned to this.state to
		// be evaluated on constrution instead of once at class definition time.
		this.state = {
			layout: getStoragePreference(LAYOUT_STORAGE_KEY) || Grid,
			requiredOnly: getStoragePreference(REQUIRED_STORAGE_KEY)
		};
	}


	componentDidUpdate (prevProps, prevState) {
		const values = ['course', 'requiredOnly', 'layout', 'outlineNode'];

		if (changed({...this.props, ...this.state}, {...prevProps, ...prevState}, values)) {
			this.setupFor(this.props);
		}
	}


	componentDidMount () {
		this.setupFor(this.props);
	}

	async setupFor (props = this.props) {
		const {requiredOnly, layout} = this.state;
		const {outlineNode, course} = this.props;

		if (!outlineNode) { return; }

		this.setState({ loading: true, error: null });

		try {
			const filterAllowed = course.CompletionPolicy && layout !== Grid;
			const overview = await outlineNode.getContent({requiredOnly: filterAllowed && requiredOnly});


			// only get progress stats if admin
			// const isAdmin = this.props.course.isAdministrative;
			// const {Items: progressByItems} = !isAdmin ? {} : await outlineNode.fetchLink('ProgressStatisticsByItem');

			this.setState({
				loading: false,
				overview,
				progressByItems: null
			});
		} catch (e) {
			this.setState({
				loading: false,
				error: e
			});
		}
	}


	setLayout = (layout) => {
		this.setState({layout});
		setStoragePreference(LAYOUT_STORAGE_KEY, layout);
	}


	setRequiredOnly = (requiredOnly) => {
		this.setState({requiredOnly});
		setStoragePreference(REQUIRED_STORAGE_KEY, requiredOnly);
	}


	render () {
		const {className, outlineNode, course, ...otherProps} = this.props;
		const {layout, requiredOnly, loading, error, overview, progressByItems} = this.state;
		const listTypeCls = layout === List ? 'nti-overview-list' : 'nti-overview-grid';

		let extraColumns = [];

		if(progressByItems) {
			extraColumns.push(CourseItemProgress);
		}

		return (
			<div className={cx('nti-lesson-view', listTypeCls, className)}>
				<Header
					outlineNode={outlineNode}
					course={course}
					overview={overview}
					layout={layout}
					requiredOnly={requiredOnly}
					setLayout={this.setLayout}
					setRequiredOnly={this.setRequiredOnly}
				/>
				<div className="content">
					{loading && (<Loading.Mask />)}
					{!loading && error && (<ErrorCmp error={error} />)}
					{!loading && !error && (
						<OverviewContents
							{...otherProps}
							outlineNode={outlineNode}
							course={course}
							overview={overview}
							layout={layout}
							requiredOnly={requiredOnly && layout !== Grid}
							progressByItems={progressByItems}
							extraColumns={extraColumns}
						/>
					)}
				</div>
			</div>
		);
	}
}
