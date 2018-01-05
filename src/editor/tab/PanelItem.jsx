import React from 'react';
import PropTypes from 'prop-types';

import Store from '../Store';
import {
	COURSE_SAVING,
	COURSE_SAVED,
	COURSE_SAVE_ERROR
} from '../Constants';

export default class WizardItem extends React.Component {
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
			this.setState({loading: true});
		} else if (data.type === COURSE_SAVE_ERROR) {
			this.setState({loading: false, errorMsg: data.errorMsg});
		} else if (data.type === COURSE_SAVED) {
			this.setState({loading: false});
		}
	}

	render () {
		const { panelCmp: Cmp, ...otherProps } = this.props;

		delete otherProps.onCancel;

		return (<div className="course-panel-item">
			<div className="course-panel-content-container">
				<Cmp errorMsg={this.state.errorMsg} {...otherProps}/>
			</div>
		</div>);
	}
}
