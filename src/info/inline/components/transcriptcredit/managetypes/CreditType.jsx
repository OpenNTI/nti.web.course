import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Input, Checkbox, RemoveButton} from '@nti/web-commons';

const t = scoped('course.info.inline.components.transcriptcredit.managetypes.CreditType', {
	disabled: 'Disabled'
});

export default class ManageCreditTypes extends React.Component {
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

	onDisabledChange = (val) => {
		const {onChange, type} = this.props;

		if(onChange) {
			onChange({...type, disabled: !type.disabled});
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
				<Checkbox label={t('disabled')} onChange={this.onDisabledChange} checked={type.disabled} />
				{!type.NTIID && <RemoveButton onRemove={this.onRemove}/>}
			</div>
		);
	}
}
