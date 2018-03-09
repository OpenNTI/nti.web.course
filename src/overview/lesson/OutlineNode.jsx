import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Storage from 'nti-web-storage';

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
		layout: Storage.getItem(STORAGE_KEY) || Grid
	}


	selectGrid = () => {
		this.setState({layout: Grid});
		Storage.setItem(STORAGE_KEY, Grid);
	}


	selectList = () => {
		this.setState({layout: List});
		Storage.setItem(STORAGE_KEY, List);
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
