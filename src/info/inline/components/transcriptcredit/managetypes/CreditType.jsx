import React from 'react';
import PropTypes from 'prop-types';
import {Input, RemoveButton} from '@nti/web-commons';

export default class CreditType extends React.Component {
	static propTypes = {
		type: PropTypes.object.isRequired,
		onChange: PropTypes.func,
		onRemove: PropTypes.func
	}

	state = {}


	onTypeChange = (val) => {
		const {onChange, type} = this.props;

		if(onChange) {
			onChange({...type, type: val});
		}
	}

	onUnitChange = (val) => {
		const {onChange, type} = this.props;

		if(onChange) {
			onChange({...type, unit: val});
		}
	}

	onRemove = () => {
		const {onRemove, type} = this.props;

		if(onRemove) {
			onRemove(type);
		}
	}

	render () {
		const {type} = this.props;

		return (
			<div className="credit-type">
				<Input.Text value={type.type} onChange={this.onTypeChange}/>
				<Input.Text value={type.unit} onChange={this.onUnitChange}/>
				<RemoveButton onRemove={this.onRemove}/>
			</div>
		);
	}
}
