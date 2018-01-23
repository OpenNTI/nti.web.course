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

		this.state = { EndDate: EndDate && new Date(EndDate), invalid: false};
	}

	onChange = (newDate) => {
		const { onValueChange, toggleSaveable } = this.props;

		this.setState({ EndDate : newDate });

		const isValid = !this.disabledDays(newDate);

		if(isValid) {
			this.setState({invalid: false});

			toggleSaveable && toggleSaveable(true);

			onValueChange && onValueChange(EndDateEdit.FIELD_NAME, newDate);
		}
		else {
			toggleSaveable && toggleSaveable(false);

			this.setState({invalid: true});
		}
	}

	disabledDays = (value) => {
		const { StartDate } = this.props.catalogEntry;

		if(!StartDate) {
			return false;
		}

		return value.getTime() < new Date(StartDate).getTime();
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
