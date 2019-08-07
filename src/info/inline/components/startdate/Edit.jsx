import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import DatePicker from '../../widgets/DatePicker';

import Disclaimer from './Disclaimer';


const t = scoped('course.info.inline.components.startdate.Edit', {
	label: 'Start Date',
	invalid: 'Start date cannot be after end date'
});

export default class StartDateEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onValueChange: PropTypes.func,
		toggleSaveable: PropTypes.func
	}

	static FIELD_NAME = 'StartDate';

	constructor (props) {
		super(props);

		const StartDate = this.props.catalogEntry.getStartDate();

		const initialDate = this.startOfEndDay() || this.startOfToday();

		const state = { StartDate: StartDate || initialDate };

		if(StartDate) {
			state.invalid = false;
			this.state = state;
		}
		else {
			const validationState = this.validateDate(initialDate);
			this.state = { StartDate: initialDate, ...validationState };
		}
	}

	validateDate (date) {
		const { onValueChange, toggleSaveable } = this.props;

		const isValid = !this.disabledDays(date);

		const newState = {};

		if(isValid) {
			newState.invalid = false;

			toggleSaveable && toggleSaveable(true);

			onValueChange && onValueChange(StartDateEdit.FIELD_NAME, date);
		}
		else {
			toggleSaveable && toggleSaveable(false);

			newState.invalid = true;
		}

		return newState;
	}

	onChange = (newDate) => {
		const validationState = this.validateDate(newDate);

		this.setState({ StartDate: newDate, ...validationState});
	}

	disabledDays = (value) => {
		const EndDate = this.props.catalogEntry.getEndDate();

		if(!EndDate) {
			return false;
		}

		return value > EndDate;
	}

	startOfDay (date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
	}

	startOfEndDay () {
		const EndDate = this.props.catalogEntry.getEndDate();

		if(!EndDate) {
			return null;
		}

		return this.startOfDay(EndDate);
	}

	startOfToday () {
		return this.startOfDay(new Date());
	}


	render () {
		const { StartDate } = this.state;

		return (
			<div className="columned">
				<div className="field-info">
					<div className="field-label">{t('label')}</div>
					<Disclaimer />
				</div>
				<div className="content-column">
					<DatePicker date={StartDate} disabledDays={this.disabledDays} onChange={this.onChange}/>
					{this.state.invalid ? (<div className="error-message">{t('invalid')}</div>) : null}
				</div>
			</div>
		);
	}
}
