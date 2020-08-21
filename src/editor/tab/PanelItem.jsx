import './PanelItem.scss';
import React from 'react';
import PropTypes from 'prop-types';

import Store from '../Store';
import {
	COURSE_SAVING,
	COURSE_SAVED,
	COURSE_SAVE_ERROR
} from '../Constants';

export default class PanelItem extends React.Component {
	static propTypes = {
		panelCmp: PropTypes.func.isRequired
	}

	constructor (props) {
		super(props);
		this.state = {};
	}

	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
	}

	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
	}

	onStoreChange = (data) => {
		if (data.type === COURSE_SAVING) {
			this.setState({loading: true, errorMsg: null});
		} else if (data.type === COURSE_SAVE_ERROR) {
			this.setState({loading: false, errorMsg: data.errorMsg});
		} else if (data.type === COURSE_SAVED) {
			this.setState({loading: false, errorMsg: null});
		}
	}

	onInputChange = (value) => {
		if(value) {
			this.setState({errorMsg: null});
		}
	}

	render () {
		const { panelCmp: Cmp, ...otherProps } = this.props;

		return (
			<div className="course-panel-item">
				<div className="course-panel-content-container">
					<Cmp errorMsg={this.state.errorMsg}onInputChange={this.onInputChange} {...otherProps}/>
				</div>
			</div>
		);
	}
}
