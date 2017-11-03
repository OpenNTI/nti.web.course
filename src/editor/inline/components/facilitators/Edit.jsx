import React from 'react';
import PropTypes from 'prop-types';
import {Prompt} from 'nti-web-commons';

import Facilitator from './Facilitator';
import AddFacilitators from './AddFacilitators';

export default class FacilitatorsEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired
	}

	static FIELD_NAME = ''; // not sure what field this corresponds to

	constructor (props) {
		super(props);

		this.state = {
			facilitatorList: props.catalogEntry.Instructors
		};
	}

	renderFacilitator = (facilitator) => {
		return <Facilitator key={facilitator.username} facilitator={facilitator} editable/>;
	}

	updateFacilitatorList = (users) => {
		const transformed = users.map(u => {
			return {
				Name: u.alias
			};
		});

		this.setState({
			facilitatorList: [...this.state.facilitatorList, ...transformed]
		});
	}

	launchAddDialog = () => {
		Prompt.modal(<AddFacilitators onConfirm={this.updateFacilitatorList}/>);
	}

	renderAddFacilitator () {
		return (
			<div className="add-facilitator">
				<div className="add-icon">
					<i className="icon-add"/>
				</div>
				<div className="add-label" onClick={this.launchAddDialog}>Add a Facilitator</div>
			</div>
		);
	}

	render () {
		return (
			<div>
				<div className="facilitators-header">
					<div className="field-label">Facilitators</div>
					{this.renderAddFacilitator()}
				</div>
				<div className="facilitators">
					{(this.state.facilitatorList || []).map(this.renderFacilitator)}
				</div>
			</div>
		);
	}
}
