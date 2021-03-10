import React from 'react';
import PropTypes from 'prop-types';

import { DateTime } from '@nti/web-commons';

export default class DateView extends React.Component {
	static propTypes = {
		date: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		label: PropTypes.string.isRequired,
		disclaimer: PropTypes.node,
	};

	static FIELD_NAME = 'StartDate';

	constructor(props) {
		super(props);
	}

	render() {
		const { date, label, disclaimer } = this.props;

		return (
			<div className="columned">
				<div className="field-info">
					<div className="date-label">{label}</div>
					{disclaimer || null}
				</div>
				<div className="content-column">
					<div className="date-value">
						{(date && DateTime.format(date)) || '-'}
					</div>
					<div className="date-info">
						{DateTime.format(
							date,
							DateTime.WEEKDAY_AT_TIME_PADDED_WITH_ZONE
						)}
					</div>
				</div>
			</div>
		);
	}
}
