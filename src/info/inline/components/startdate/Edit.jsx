import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import DatePicker from '../../widgets/DatePicker';

const LABELS = {
	label: 'Start Date',
	description: 'Delay when people can start.',
	invalid: 'Start date cannot be after end date'
};

const t = scoped('components.course.editor.inline.components.startdate.edit', LABELS);

export default class StartDateEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onValueChange: PropTypes.func,
		toggleSaveable: PropTypes.func
	}

	static FIELD_NAME = 'StartDate';

	constructor (props) {
		super(props);

		const { StartDate } = this.props.catalogEntry;

		this.state = { StartDate: StartDate && new Date(StartDate), invalid: false};
	}

	onChange = (newDate) => {
		const { onValueChange, toggleSaveable } = this.props;

		this.setState({ StartDate : newDate });

		const isValid = !this.disabledDays(newDate);

		if(isValid) {
			this.setState({invalid: false});

			toggleSaveable && toggleSaveable(true);

			onValueChange && onValueChange(StartDateEdit.FIELD_NAME, newDate);
		}
		else {
			toggleSaveable && toggleSaveable(false);

			this.setState({invalid: true});
		}
	}

	disabledDays = (value) => {
		const { EndDate } = this.props.catalogEntry;

		if(!EndDate) {
			return false;
		}

		return value.getTime() > new Date(EndDate).getTime();
	}

	render () {
		const { StartDate } = this.state;

		return (
			<div className="columned">
				<div className="field-info">
					<div className="field-label">{t('label')}</div>
					<div className="field-description">{t('description')}</div>
				</div>
				<div className="content-column">
					<DatePicker date={StartDate} disabledDays={this.disabledDays} onChange={this.onChange}/>
					{this.state.invalid ? (<div className="error-message">{t('invalid')}</div>) : null}
				</div>
			</div>
		);
	}
}
