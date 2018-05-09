import React from 'react';
import PropTypes from 'prop-types';

export default class RequirementControlOption extends React.Component {
	static propTypes = {
		option: PropTypes.object.isRequired,
		onChange: PropTypes.func,
		isSelected: PropTypes.bool
	}

	onClick = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const {onChange} = this.props;

		if(onChange) {
			onChange(this.props.option.value);
		}
	}

	render () {
		return (
			<div className="require-control-option" onClick={this.onClick}>
				{this.props.isSelected && <i className="icon-check"/>}
				{this.props.option.label}
			</div>
		);
	}
}
