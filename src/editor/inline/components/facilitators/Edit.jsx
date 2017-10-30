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

		this.state = {};
	}

	renderFacilitator = (facilitator) => {
		return <Facilitator key={facilitator.username} facilitator={facilitator} editable/>;
	}

	launchAddDialog () {
		Prompt.modal(<AddFacilitators/>);
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
		const { catalogEntry } = this.props;

		return (
			<div>
				<div className="facilitators-header">
					<div className="field-label">Facilitators</div>
					{this.renderAddFacilitator()}
				</div>
				<div className="facilitators">
					{(catalogEntry.Instructors || []).map(this.renderFacilitator)}
				</div>
			</div>
		);
	}
}
