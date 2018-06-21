import React from 'react';
import PropTypes from 'prop-types';

export default class FieldView extends React.Component {
	static propTypes = {
		label: PropTypes.string,
		value: PropTypes.string
	}

	render () {
		return (
			<div className="field-view">
				<div className="field-label">{this.props.label}</div>
				<div className="field-value">{this.props.value}</div>
			</div>
		);
	}
}
