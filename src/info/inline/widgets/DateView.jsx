import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'nti-web-commons';

export default class DateView extends React.Component {
	static propTypes = {
		date: PropTypes.object,
		label: PropTypes.string.isRequired
	}

	static FIELD_NAME = 'StartDate';

	constructor (props) {
		super(props);
	}

	render () {
		const { date, label } = this.props;

		return (
			<div className="columned">
				<div className="field-info">
					<div className="date-label">{label}</div>
				</div>
				<div className="content-column">
					<div className="date-value">{(date && DateTime.format(date)) || '-'}</div>
					<div className="date-info">{DateTime.format(date, 'dddd [at] hh:mm a z')}</div>
				</div>
			</div>
		);
	}
}
