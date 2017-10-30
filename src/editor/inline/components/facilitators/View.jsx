import React from 'react';
import PropTypes from 'prop-types';

import Facilitator from './Facilitator';

export default class FacilitatorsView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired
	}

	static FIELD_NAME = ''; // what field?

	constructor (props) {
		super(props);

		this.state = {};
	}

	renderFacilitator = (facilitator) => {
		return <Facilitator key={facilitator.username} facilitator={facilitator}/>;
	}

	render () {
		const { catalogEntry } = this.props;

		return (
			<div className="facilitators">
				{(catalogEntry.Instructors || []).map(this.renderFacilitator)}
			</div>
		);
	}
}
