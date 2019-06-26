import React from 'react';
import PropTypes from 'prop-types';

import Uploading from './Uploading';
import UploadingFailed from './UploadFailed';
import Processing from './Processing';
import ProcessingFailed from './ProcessingFailed';
import Ready from './Ready';

const STATES = [
	(pack) => pack.isTask && pack.isRejected ? UploadingFailed : null,
	(pack) => pack.isTask ? Uploading : null,
	(pack) => pack.isErrored ? ProcessingFailed : null,
	(pack) => pack.isProcessing ? Processing : null,
	() => Ready
];

export default class SCORMPackageView extends React.Component {
	static propTypes = {
		package: PropTypes.object.isRequired
	}

	componentDidMount () {
		this.addListener();
	}

	componentWillUnmount () {
		this.removeListener();
	}

	componentDidUpdate (prevProps) {
		const {package: pack} = this.props;
		const {package: oldPack} = prevProps;

		if (pack !== oldPack) {
			this.addListener();
		}
	}


	addListener () {
		if (this.cleanupListener) {
			this.cleanupListener();
		}

		const {package: pack} = this.props;
		const onChange = () => this.forceUpdate();

		if (pack.addChangeListener) {
			pack.addChangeListener(onChange);
			this.cleanupListener = () => {
				pack.removeChangeListener(onChange);
				delete this.cleanupListener;
			};
		} else if (pack.addListener) {
			pack.addListener('change', onChange);
			this.cleanupListener = () => {
				pack.removeListener('change', onChange);
				delete this.cleanupListener;
			};
		}
	}

	removeListener () {
		if (this.cleanupListener) {
			this.cleanupListener();
		}
	}


	render () {
		const {package: pack} = this.props;

		for (let state of STATES) {
			const Cmp = state(pack);

			if (Cmp) {
				return (<Cmp {...this.props} />);
			}
		}

		return null;
	}
}