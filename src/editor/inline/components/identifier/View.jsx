import React from 'react';
import PropTypes from 'prop-types';

export default class IdentifierView extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired
	}

	static FIELD_NAME = 'ProviderUniqueID';

	constructor (props) {
		super(props);

		this.state = {};
	}

	render () {
		return (
			<div className="course-view-identifier">{this.props.catalogEntry[IdentifierView.FIELD_NAME]}</div>
		);
	}
}
