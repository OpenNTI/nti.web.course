import React from 'react';
import PropTypes from 'prop-types';
import { TokenEditor, Avatar } from 'nti-web-commons';
import { getService } from 'nti-web-client';

export default class AddFacilitators extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onDismiss: PropTypes.func,
		onConfirm: PropTypes.func
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

	suggestionProvider = (value) => {

		return getService()
			.then(s => s.getContacts())
			.then((contacts) => {
				return contacts.search(value, false, true)
					.then((results) => {
						const users = results.filter(entity => entity.isUser );

						return users.map(x => {
							return {
								display: x.alias,
								value: x,
								view: (<Suggestion user={x}/>)
							};
						});
					});
			});
	}

	onChange = (values) => {
		this.setState({values});
	}

	addFacilitators = () => {
		const { onConfirm } = this.props;

		onConfirm && onConfirm(this.state.values.map(x => x.value || x));

		this.onClose();
	}

	render () {
		return (
			<div className="add-facilitators">
				<div className="header">
					<div className="label">Add Facilitators</div>
					<div className="close" onClick={this.onClose}><i className="icon-light-x"/></div>
				</div>
				<div className="input">
					<TokenEditor
						value={this.state.values}
						placeholder="Add users"
						suggestionProvider={this.suggestionProvider}
						onChange={this.onChange}/>
				</div>
				<div className="controls">
					<div className="buttons">
						<div className="cancel" onClick={this.onClose}>Cancel</div>
						<div className="confirm" onClick={this.addFacilitators}>Add</div>
					</div>
				</div>
			</div>
		);
	}
}

Suggestion.propTypes = {
	user: PropTypes.object.isRequired
};

function Suggestion ({user}) {
	return (
		<div className="user-suggestion">
			<Avatar className="image" entity={'abc'}/>
			<div className="user-info">
				<div className="alias">{user.alias}</div>
				<div className="email">{user.email}</div>
			</div>
		</div>
	);
}
