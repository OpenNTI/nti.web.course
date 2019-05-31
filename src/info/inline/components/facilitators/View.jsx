import React from 'react';
import PropTypes from 'prop-types';

import Facilitator from './Facilitator';

export default class FacilitatorsView extends React.Component {
	static propTypes = {
		facilitators: PropTypes.arrayOf(PropTypes.object),
		courseInstance: PropTypes.object.isRequired
	}

	static hasData = (catalogEntry, {facilitators = []}  = {}) => facilitators.length

	static FIELD_NAME = 'Instructors';

	state = {}

	renderFacilitator = (facilitator) => {
		// username can be blank, but a combination of username + Name is hopefully unique
		return <Facilitator key={facilitator.username + facilitator.Name} courseInstance={this.props.courseInstance} facilitator={facilitator}/>;
	}

	render () {
		const { facilitators } = this.props;

		return (
			<div className="facilitators">
				{(facilitators || [])
					.filter(x => x.role)
					.map(this.renderFacilitator)}
			</div>
		);
	}
}
