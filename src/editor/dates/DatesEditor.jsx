import React from 'react';
import PropTypes from 'prop-types';
import {DateTime, CalendarCard, DayPicker} from 'nti-web-commons';

export default class DatesEditor extends React.Component {
	static propTypes = {
		course: PropTypes.object
	}

	loadCatalogEntry (course) {

	}

	render () {
		const {course} = this.props;

		if(!course) {
			return (<div>Fetching course info...</div>);
		}

		const start = new Date(course.CatalogEntry.StartDate);
		const end = new Date(course.CatalogEntry.EndDate);

		return (<div>
			<div>Start date:{course.CatalogEntry.StartDate}</div>
			<div>End date:{course.CatalogEntry.EndDate}</div>
			<CalendarCard date={start}/>
			<CalendarCard date={end}/>
			<DateTime date={start} className="month" format="MMM"/>
			<DateTime date={start} className="day" format="DD"/>
			<DateTime date={start} className="year" format="YYYY"/>
			<DayPicker value={start}/>
		</div>
		);
	}
}
