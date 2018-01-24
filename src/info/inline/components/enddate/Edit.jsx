import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import DatePicker from '../../widgets/DatePicker';

const LABELS = {
	label: 'End Date',
	description: 'When class is officially over.',
	invalid: 'End date cannot be before start date'
};

const t = scoped('components.course.editor.inline.components.enddate.edit', LABELS);

export default class EndDateEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onValueChange: PropTypes.func,
		toggleSaveable: PropTypes.func
	}

	static FIELD_NAME = 'EndDate';

	constructor (props) {
		super(props);

		const { EndDate } = this.props.catalogEntry;

		const initialDate = this.endOfStartDay() || this.endOfToday();

		const state = { EndDate: (EndDate && new Date(EndDate)) || initialDate };

		if(EndDate) {
			state.invalid = false;
			this.state = state;
		}
		else {
			const validationState = this.validateDate(initialDate);
			this.state = { EndDate: initialDate, ...validationState };
		}
	}

	validateDate (date) {
		const { onValueChange, toggleSaveable } = this.props;

		const isValid = !this.disabledDays(date);

		const newState = {};

		if(isValid) {
			newState.invalid = false;

			toggleSaveable && toggleSaveable(true);

			onValueChange && onValueChange(EndDateEdit.FIELD_NAME, date);
		}
		else {
			toggleSaveable && toggleSaveable(false);

			newState.invalid = true;
		}

		return newState;
	}

	onChange = (newDate) => {
		const validationState = this.validateDate(newDate);

		this.setState({ EndDate: newDate, ...validationState});
	}

	disabledDays = (value) => {
		const { StartDate } = this.props.catalogEntry;

		if(!StartDate) {
			return false;
		}

		return value.getTime() < new Date(StartDate).getTime();
	}

	endOfDay (date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 0);
	}

	endOfStartDay () {
		const { StartDate } = this.props.catalogEntry;

		if(!StartDate) {
			return null;
		}

		return this.endOfDay(new Date(StartDate));
	}

	endOfToday () {
		return this.endOfDay(new Date());
	}

	render () {
		const { EndDate } = this.state;

		return (
			<div className="columned">
				<div className="field-info">
					<div className="field-label">{t('label')}</div>
					<div className="field-description">{t('description')}</div>
				</div>
				<div className="content-column">
					<DatePicker date={EndDate} disabledDays={this.disabledDays} onChange={this.onChange}/>
					{this.state.invalid ? (<div className="error-message">{t('invalid')}</div>) : null}
				</div>
			</div>
		);
	}
}
