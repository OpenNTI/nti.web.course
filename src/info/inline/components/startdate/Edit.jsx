import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import DatePicker from '../../widgets/DatePicker';

const LABELS = {
	label: 'Start Date',
	description: 'Delay when people can start.'
};

const t = scoped('components.course.editor.inline.components.startdate.edit', LABELS);

export default class StartDateEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onValueChange: PropTypes.func
	}

	static FIELD_NAME = 'StartDate';

	constructor (props) {
		super(props);

		const { StartDate } = this.props.catalogEntry;

		this.state = { StartDate: StartDate && new Date(StartDate)};
	}

	onChange = (newDate) => {
		const { onValueChange } = this.props;

		this.setState({ StartDate : newDate });

		onValueChange && onValueChange(StartDateEdit.FIELD_NAME, newDate);
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
				</div>
			</div>
		);
	}
}
