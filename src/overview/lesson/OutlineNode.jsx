import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Storage from 'nti-web-storage';
import {getAppUsername} from 'nti-web-client';
import {Loading, Error} from 'nti-web-commons';

import {Grid, List} from './Constants';
import Header from './Header';
import OverviewContents from './OverviewContents';

const STORAGE_KEY = 'nti-lesson-view';
const LAYOUT_STORAGE_KEY = 'layout-value';
const REQUIRED_STORAGE_KEY = 'required-only-value';

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
			const {requiredOnly, layout} = this.state;
			const {outlineNode} = this.props;

			if (!outlineNode) { return; }

			try {
				const overview = await outlineNode.getContent({requiredOnly: requiredOnly && layout === List});

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


	setLayout = (layout) => {
		this.setState({layout});
		setStoragePreference(LAYOUT_STORAGE_KEY, Grid);
	}


	setRequiredOnly = (requiredOnly) => {
		this.setState({requiredOnly});
		setStoragePreference(REQUIRED_STORAGE_KEY, requiredOnly);
	}


	render () {
		const {className, outlineNode, course, ...otherProps} = this.props;
		const {layout, requiredOnly, loading, error, overview} = this.state;
		const listTypeCls = layout === List ? 'nti-overview-list' : 'nti-overview-grid';

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
					{!loading && error && (<Error error={error} />)}
					{!loading && !error && (
						<OverviewContents
							{...otherProps}
							outlineNode={outlineNode}
							course={course}
							overview={overview}
							layout={layout}
							requiredOnly={requiredOnly}
						/>
					)}
				</div>
			</div>
		);
	}
}
