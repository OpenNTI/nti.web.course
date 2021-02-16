import './Edit.scss';
import React from 'react';
import PropTypes from 'prop-types';

export default class PrerequisitesEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onValueChange: PropTypes.func,
	};

	static FIELD_NAME = 'Prerequisites';

	constructor(props) {
		super(props);

		this.state = { value: props.catalogEntry.Prerequisites };
	}

	onChange = val => {};

	render() {
		// TODO: Implement editing these, not sure what do for editing yet

		return <div />;
	}
}
