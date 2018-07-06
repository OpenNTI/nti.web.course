import React from 'react';
import PropTypes from 'prop-types';

import Registration from './panels/Registration';
import Overview from './panels/Overview';
import NotConnected from './panels/NotConnected';

const REGISTRATION = 'registration';
const OVERVIEW = 'overview';
const NOT_CONNECTED = 'not-connected';

export default class WebinarEditor extends React.Component {
	static propTypes = {

	}

	state = {
		activePanel: REGISTRATION
	}

	togglePanel = () => {
		if(this.state.activePanel === REGISTRATION) {
			this.setState({activePanel: OVERVIEW});
		}
		else if(this.state.activePanel === NOT_CONNECTED) {
			this.setState({activePanel: REGISTRATION});
		}
		else {
			this.setState({activePanel: NOT_CONNECTED});
		}
	}

	render () {
		return (
			<div>
				<div onClick={this.togglePanel}>Toggle</div>
				{this.state.activePanel === REGISTRATION && <Registration/>}
				{this.state.activePanel === OVERVIEW && <Overview/>}
				{this.state.activePanel === NOT_CONNECTED && <NotConnected/>}
			</div>
		);
	}
}
