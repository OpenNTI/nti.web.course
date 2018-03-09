import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {Grid, List} from './Constants';
import Overview from './Overview';
import PaddedContainer from './common/PaddedContainer';

const RADIO_GROUP = 'nti-lesson-view-layout';

export default class LessonView extends React.Component {
	static propTypes = {
		className: PropTypes.string,
	}

	state = {
		layout: Grid
	}


	selectGrid = () => {
		this.setState({layout: Grid});
	}


	selectList = () => {
		this.setState({layout: List});
	}


	render () {
		const {className, ...otherProps} = this.props;
		const {layout} = this.state;

		return (
			<div className={cx('nti-lesson-view', className)}>
				<PaddedContainer className="header">
					<label className="grid">
						<input type="radio" group={RADIO_GROUP} checked={layout === Grid} onChange={this.selectGrid} />
						<span>Grid</span>
					</label>
					<label className="list">
						<input type="radio" group={RADIO_GROUP} checked={layout === List} onChange={this.selectList} />
						<span>List</span>
					</label>
				</PaddedContainer>
				<Overview {...otherProps} layout={layout} />
			</div>
		);
	}
}
