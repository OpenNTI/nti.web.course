import './RequirementControl.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import {Flyout} from '@nti/web-commons';
import cx from 'classnames';

import RequirementControlOption from './RequirementControlOption';

const t = scoped('course.components.RequirementControl', {
	required: 'Required',
	optional: 'Optional',
	default: 'Default'
});

const DEFAULT = t('default');
const REQUIRED = t('required');
const OPTIONAL = t('optional');

export default class RequirementControl extends React.Component {
	static propTypes = {
		record: PropTypes.object.isRequired,
		onChange: PropTypes.func,
		className: PropTypes.string
	}

	state = {}

	attachFlyoutRef = x => this.flyout = x

	componentDidMount () {
		const {record} = this.props;

		const basedOnDefault = record.IsCompletionDefaultState;
		const isRequired = record.CompletionRequired;
		const requiredValue = basedOnDefault ? DEFAULT : isRequired ? REQUIRED : OPTIONAL;
		const defaultValue = record.CompletionDefaultState ? REQUIRED : OPTIONAL;

		this.setState({
			value: requiredValue,
			options: [
				{ label: DEFAULT + ' (' + defaultValue + ')', value: DEFAULT },
				{ label: REQUIRED, value: REQUIRED },
				{ label: OPTIONAL, value: OPTIONAL }
			]});
	}

	renderTrigger () {
		const selectedOption = (this.state.options || []).filter(x => x.value === this.state.value)[0] || {};

		const className = cx('require-control-value', this.props.className);

		return <div className={className}><span>{selectedOption.label}</span><i className="icon-chevron-down"/></div>;
	}

	onChange = (newValue) => {
		const {onChange} = this.props;

		if(this.flyout) {
			this.flyout.dismiss();
		}

		this.setState({value: newValue});

		if(onChange) {
			onChange(newValue);
		}
	}

	renderOption = (option) => {
		const isSelected = option.value === this.state.value;

		return <RequirementControlOption key={option.value} option={option} onChange={this.onChange} isSelected={isSelected}/>;
	}

	render () {
		if(!this.state.options) {
			return null;
		}

		const className = cx('require-control', this.props.className);

		return (
			<Flyout.Triggered
				className={className}
				trigger={this.renderTrigger()}
				ref={this.attachFlyoutRef}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			>
				<div>
					{(this.state.options || []).map(this.renderOption)}
				</div>
			</Flyout.Triggered>
		);
	}
}
