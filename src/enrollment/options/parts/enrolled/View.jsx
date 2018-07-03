import React from 'react';
import PropTypes from 'prop-types';

import Current from './Current';
import Upgrade from './Upgrade';

export default class CourseEnrollmentEnrolled extends React.Component {
	static propTypes = {
		options: PropTypes.array,
		cataglogEntry: PropTypes.object
	}

	state = {updating: false}

	componentDidMount () {
		this.setupFor(this.props);
	}

	componentDidUpdate (prevProps) {
		const {options:oldOptions} = prevProps;
		const {options:newOptions} = this.props;

		if (oldOptions !== newOptions) {
			this.setupFor(this.props);
		}
	}


	setupFor (props) {
		const {options} = props;

		this.setState({
			enrolled: options.find(option => option.isEnrolled()),
			upgradeOptions: options.filter(option => option.isAvailable())
		});
	}


	doUpgrade = () => {
		this.setState({
			updating: true
		});
	}


	cancelUpgrade = () => {
		this.setState({
			updating: false
		});
	}


	render () {
		const {updating} = this.state;

		return (
			<div className="nti-coursene-enrollment-options-enrolled">
				{updating ? this.renderUpdate() : this.renderEnrolled()}
			</div>
		);
	}


	renderEnrolled () {
		const {enrolled, upgradeOptions} = this.state;

		if (!enrolled) {
			return null;
		}

		return (
			<Current
				option={enrolled}
				hasUpdates={upgradeOptions && upgradeOptions.length > 1}
				doUpgrade={this.doUpgrade}
			/>
		);
	}


	renderUpdate () {
		const {upgradeOptions} = this.state;

		return (
			<Upgrade
				options={upgradeOptions}
				onCancel={this.cancelUpgrade}
			/>
		);
	}
}
