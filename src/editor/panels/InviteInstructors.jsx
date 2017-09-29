import React from 'react';
import PropTypes from 'prop-types';

export default class InviteInstructors extends React.Component {
	static propTypes = {
		instructors: PropTypes.arrayOf(PropTypes.string)
	}

	constructor (props) {
		super(props);
		this.state = {};
	}

	render () {
		return (<div className="invite-instructors">
			<div className="instructions">
				<div>Send an email invite to your instructor.</div>
				<div>Comma separate emails for multiple instructors.</div>
			</div>
		</div>
		);
	}
}
