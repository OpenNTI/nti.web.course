import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import DatePicker from '../../widgets/DatePicker';

const LABELS = {
	label: 'End Date'
};

const t = scoped('components.course.editor.inline.components.enddate.edit', LABELS);

export default class EndDateEdit extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		onValueChange: PropTypes.func
	}

	static FIELD_NAME = 'EndDate';

	constructor (props) {
		super(props);

		const { EndDate } = this.props.catalogEntry;

		this.state = { EndDate: EndDate && new Date(EndDate)};
	}

	onChange = (newDate) => {
		const { onValueChange } = this.props;

		this.setState({ EndDate : newDate });

		onValueChange && onValueChange(EndDateEdit.FIELD_NAME, newDate);
	}

	render () {
		const { EndDate } = this.state;

		return (
			<div className="columned">
				<div className="field-info">
					<div className="field-label">{t('label')}</div>
					<div className="field-description">When class is officially over.</div>
				</div>
				<div className="content-column">
					<DatePicker date={EndDate} onChange={this.onChange}/>
				</div>
			</div>
		);
	}
}
