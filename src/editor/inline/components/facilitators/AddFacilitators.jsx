import React from 'react';
import PropTypes from 'prop-types';
import { TokenEditor, Input } from 'nti-web-commons';

export default class AddFacilitators extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onDismiss: PropTypes.func
	}

	constructor (props) {
		super(props);

		this.state = {};
	}

	onClose = () => {
		this.props.onDismiss();
	}

	onMessageChange = (value) => {
		this.setState({message: value});
	}

	render () {
		return (
			<div className="add-facilitators">
				<div className="header">
					<div className="label">Add Facilitators</div>
					<div className="close" onClick={this.onClose}><i className="icon-light-x"/></div>
				</div>
				<div className="input">
					<TokenEditor placeholder="Add users or email addresses"/>
				</div>
				<div className="message">
					<Input.TextArea placeholder="Write a message" value={this.state.message} onChange={this.onMessageChange}/>
				</div>
				<div className="controls">
					<div className="buttons">
						<div className="cancel" onClick={this.onClose}>Cancel</div>
						<div className="confirm">Invite</div>
					</div>
				</div>
			</div>
		);
	}
}
