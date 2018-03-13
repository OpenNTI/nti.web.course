import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Storage from 'nti-web-storage';
import {getAppUsername} from 'nti-web-client';

import {Grid, List} from './Constants';
import Overview from './Overview';
import PaddedContainer from './common/PaddedContainer';

const RADIO_GROUP = 'nti-lesson-view-layout';
const STORAGE_KEY = 'nti-lesson-view-layout-value';

export default class LessonView extends React.Component {
	static propTypes = {
		className: PropTypes.string,
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


	render () {
		const {className, ...otherProps} = this.props;
		const {layout} = this.state;

		return (
			<div className={cx('nti-lesson-view', className)}>
				<PaddedContainer className="header">
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
