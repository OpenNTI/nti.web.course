import React from 'react';
import PropTypes from 'prop-types';

import Facilitator from './Facilitator';

export default class FacilitatorsView extends React.Component {
	static propTypes = {
		facilitators: PropTypes.arrayOf(PropTypes.object),
		courseInstance: PropTypes.object.isRequired,
		editable: PropTypes.bool
	}

	static FIELD_NAME = 'Instructors';

	constructor (props) {
		super(props);

		this.state = {};
	}

	renderFacilitator = (facilitator) => {
		return <Facilitator key={facilitator.username} courseInstance={this.props.courseInstance} facilitator={facilitator} adminView={this.props.editable}/>;
	}

	render () {
		const { facilitators, editable } = this.props;

		return (
			<div className="facilitators">
				{(facilitators || []).filter(x => {
					if(editable) {
						return true;
					}

					if(!x.role || x.role === '') {
						return false;
					}

					return x.visible;
				}).map(this.renderFacilitator)}
			</div>
		);
	}
}
