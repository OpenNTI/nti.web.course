import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {Loading} from '@nti/web-commons';

import Facilitator from './Facilitator';
import LoadAll from './LoadAll';

export default class FacilitatorsView extends React.Component {
	static propTypes = {
		facilitators: PropTypes.arrayOf(PropTypes.object),
		showingFullFacilitatorSet: PropTypes.bool,
		showingFacilitatorEditor: PropTypes.bool,
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
		const { facilitators, showingFacilitatorEditor: showingEditor, showingFullFacilitatorSet:showFull } = this.props;
		const filter = showFull ? (x => x.role) : (x => x.role && x.visible);

		return (
			<Loading.Placeholder loading={showingEditor} fallback={(<Loading.Spinner />)} delay={100}>
				<div className="facilitators">
					{(facilitators || [])
						.filter(filter)
						.map(this.renderFacilitator)}
					<LoadAll {...this.props} />
				</div>
			</Loading.Placeholder>
		);
	}
}
