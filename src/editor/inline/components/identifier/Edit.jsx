import React from 'react';
import PropTypes from 'prop-types';

export default class IdentifierEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired
	}

	// no static FIELD_NAME because identifier is not editable currently

	constructor (props) {
		super(props);

		this.state = {};
	}

	render () {
		return null; // no editor for identifier
	}
}
