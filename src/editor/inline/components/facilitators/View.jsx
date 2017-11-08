import React from 'react';
import PropTypes from 'prop-types';

import Facilitator from './Facilitator';

export default class FacilitatorsView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		facilitators: PropTypes.arrayOf(PropTypes.object),
		editable: PropTypes.bool
	}

	static FIELD_NAME = 'Instructors';

	constructor (props) {
		super(props);

		this.state = {};
	}

	renderFacilitator = (facilitator) => {
		return <Facilitator key={facilitator.username} facilitator={facilitator}/>;
	}

	render () {
		const { facilitators, editable } = this.props;

		return (
			<div className="facilitators">
				{(facilitators || []).filter(x => {
					if(editable) {
						return true;
					}

					return x.visible;
				}).map(this.renderFacilitator)}
			</div>
		);
	}
}
