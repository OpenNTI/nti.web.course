import React from 'react';
import PropTypes from 'prop-types';


export default class ProcessingPackage extends React.PureComponent {
	static propTypes = {
		package: PropTypes.object
	}


	componentDidMount () {
		this.setup();
	}


	componentWillUnmount () {
		this.teardown();
	}


	componentDidUpdate (prevProps) {
		const {package: pack} = this.props;
		const {package: oldPack} = prevProps;

		if (pack !== oldPack) {
			this.setup();
		}
	}


	setup () {
		this.teardown();

		const {package: pack} = this.props;

		this.pollingTask = pack.getPoll();
		this.pollingTask.start();
	}


	teardown () {
		if (this.pollingTask && this.pollingTask.canCancel) {
			this.pollingTask.cancel();
		}
	}


	render () {
		return (
			<div>
				Processing
			</div>
		);
	}
}