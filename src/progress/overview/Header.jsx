import React from 'react';
import PropTypes from 'prop-types';

export default class ProgressOverviewHEader extends React.Component {
	static propTypes = {
		enrollment: PropTypes.object,
		doClose: PropTypes.func,
		singleItem: PropTypes.bool,

		hasNextItem: PropTypes.bool,
		hasPrevItem: PropTypes.bool,

		loadNextItem: PropTypes.func,
		loadPrevItem: PropTypes.func
	}


	doClose = () => {
		const {doClose} = this.props;

		if (doClose) {
			doClose();
		}
	}


	render () {
		const {singleItem} = this.props;

		return (
			<div className="progress-overview-header">
				{!singleItem && (this.renderPager())}
				{singleItem && (<div className="spacer"/>)}
				<div className="close" onClick={this.doClose}>
					<i className="icon-light-x" />
				</div>
			</div>
		);
	}


	renderPager () {

	}
}
