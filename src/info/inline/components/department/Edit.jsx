import './Edit.scss';
import React from 'react';
import PropTypes from 'prop-types';

export default class DepartmentEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onValueChange: PropTypes.func,
	};

	//static FIELD_NAME = '';

	constructor(props) {
		super(props);

		this.state = { value: props.catalogEntry.Title };
	}

	onChange = val => {};

	render() {
		// TODO: Implement editing these, not sure what to do for editing these yet

		return <div />;
	}
}
